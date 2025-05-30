// esbuildPlugin/utils.ts
import { fileURLToPath } from "url";
import path, { join, dirname, relative, parse } from "path";
import { template } from "lodash-es";
import fs from "fs/promises";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var defaultHtmlTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;
async function renderTemplate(templatePath, define) {
  if (templatePath) {
    const filePath = join(__dirname, templatePath);
    let templateHtml = "";
    try {
      await fs.access(filePath);
      templateHtml = await fs.readFile(filePath, "utf8");
      if (define) {
        const compiled = template(templateHtml, {}, "");
        templateHtml = compiled(define);
      }
    } catch (e) {
    }
    return templateHtml;
  }
  return defaultHtmlTemplate;
}
async function collectEntrypoints(entryPoints, metafile) {
  const filterEntryPoints = Object.entries(metafile?.outputs || {}).filter(([, value]) => {
    if (!value.entryPoint) {
      return false;
    }
    return entryPoints.includes(value.entryPoint);
  }).map((outputData) => {
    return { path: outputData[0], ...outputData[1] };
  });
  return filterEntryPoints;
}
function posixJoin(...paths) {
  const joined = join(...paths);
  if (path.sep === "/") {
    return joined;
  }
  return joined.split(path.sep).join(path.posix.sep);
}
async function injectFiles(dom, collectedOutputFiles, outdir) {
  const document = dom.window.document;
  for (const outputFile of collectedOutputFiles) {
    const ext = parse(outputFile.path).ext;
    const targetPath = relative(outdir, outputFile.path);
    if (ext === ".css") {
      const linkTag = document.createElement("link");
      linkTag.setAttribute("rel", "stylesheet");
      linkTag.setAttribute("href", targetPath);
      document.head.appendChild(linkTag);
    }
    if (ext === ".js") {
      const scriptTag = document.createElement("script");
      scriptTag.setAttribute("src", targetPath);
      document.body.append(scriptTag);
    }
  }
}
async function injectAssets(dom, assets, outdir) {
  const { window } = dom;
  const document = window.document;
  for (const asset of assets) {
    const ext = path.extname(asset).toLowerCase();
    if (ext === ".css") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = asset.startsWith("http") ? asset : path.posix.relative(outdir, asset);
      document.head.appendChild(link);
    } else if (ext === ".js") {
      const script = document.createElement("script");
      script.src = asset.startsWith("http") ? asset : path.posix.relative(outdir, asset);
      document.body.appendChild(script);
    }
  }
}

// esbuildPlugin/htmlPlugin.ts
import fs2 from "fs/promises";
import * as path2 from "path";
import { JSDOM } from "jsdom";
var htmlPlugin = (options) => {
  if (!Array.isArray(options)) {
    throw new TypeError(
      `htmlPlugin options \u5FC5\u987B\u4E3A\u6570\u7EC4\u7C7B\u578B\uFF0C\u5F53\u524D\u4F20\u5165\u7C7B\u578B\uFF1A${typeof options}`
    );
  }
  return {
    name: "html-create-plugin",
    setup(build) {
      build.onEnd(async (result) => {
        const startTime = Date.now();
        try {
          for (let i = 0; i < options.length; i++) {
            const {
              templatePath,
              define,
              outDir,
              entryPoints,
              file,
              assets
            } = options[i];
            const outdir = outDir || build.initialOptions.outdir || "dist";
            const templateContent = await renderTemplate(templatePath, define);
            const collectedEntrypoints = await collectEntrypoints(
              entryPoints,
              result.metafile
            );
            let collectedOutputFiles = [];
            for (const entrypoint of collectedEntrypoints) {
              if (!entrypoint) {
                throw new Error(`Found no match for ${entryPoints}`);
              }
              const relatedOutputFiles = /* @__PURE__ */ new Map();
              relatedOutputFiles.set(entrypoint.path, entrypoint);
              if (entrypoint?.cssBundle) {
                relatedOutputFiles.set(entrypoint.cssBundle, {
                  path: entrypoint?.cssBundle
                });
              }
              collectedOutputFiles = [
                ...collectedOutputFiles,
                ...relatedOutputFiles.values()
              ];
            }
            const dom = new JSDOM(templateContent);
            await injectFiles(dom, collectedOutputFiles, outdir).catch((e) => {
              console.error(e);
            });
            if (Array.isArray(assets) && assets.length > 0) {
              await injectAssets(dom, assets, outdir);
            }
            const out = posixJoin(outdir, file);
            await fs2.mkdir(path2.dirname(out), { recursive: true });
            await fs2.writeFile(out, dom.serialize());
            const finishTime = new Date(
              Date.now() - startTime
            ).getMilliseconds();
            console.log(
              "\x1B[32m%s\x1B[0m",
              "\u2705 [ htmlPlugin create success ] after " + finishTime + "ms"
            );
          }
        } catch (e) {
          throw new Error(`\x1B[31m\u274C [ htmlPlugin \u6784\u5EFA\u5931\u8D25 ]\x1B[0m ${e}`);
        }
      });
    }
  };
};
var htmlPlugin_default = htmlPlugin;
export {
  htmlPlugin_default as default
};
