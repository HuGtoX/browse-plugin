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
    console.log("-- [ outputFile ] --", outputFile.path);
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

// esbuildPlugin/htmlPlugin.ts
import fs2 from "fs/promises";
import * as path2 from "path";
import { JSDOM } from "jsdom";
var htmlPlugin = (options) => {
  return {
    name: "html-create-plugin",
    setup(build) {
      build.onEnd(async (result) => {
        const startTime = Date.now();
        const { templatePath, file, outputPath } = options;
        try {
          const outdir = outputPath || build.initialOptions.outdir || "dist";
          const templateContent = await renderTemplate(
            templatePath,
            options.define
          );
          const collectedEntrypoints = await collectEntrypoints(
            options.entryPoints,
            result.metafile
          );
          let collectedOutputFiles = [];
          for (const entrypoint of collectedEntrypoints) {
            if (!entrypoint) {
              throw new Error(`Found no match for ${options.entryPoints}`);
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
          const out = posixJoin(outdir, options.file);
          await fs2.mkdir(path2.dirname(out), { recursive: true });
          await fs2.writeFile(out, dom.serialize());
          const finishTime = new Date(Date.now() - startTime).getMilliseconds();
          console.log(
            "\x1B[32m%s\x1B[0m",
            "\u2705 [ htmlPlugin create success ] after " + finishTime + "ms"
          );
        } catch (e) {
          console.log("-- [ e ] --", e);
        }
      });
    }
  };
};
var htmlPlugin_default = htmlPlugin;
export {
  htmlPlugin_default as default
};
