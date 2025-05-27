import esbuild from "esbuild";
import { fileURLToPath } from "url";
import path, { join, dirname, relative, parse } from "path";
import { template } from "lodash-es";
import { JSDOM } from "jsdom";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface HtmlPluginOptions {
  templatePath?: string; // 模板文件路径
  outDir?: string; // 输出文件路径
  entryPoints: string[];
  file: string; // 输出文件名
  define?: Record<string, string>;
  assets?: string[]; // 用于指定额外需要注入的静态资源（CSS/JS）
}

const defaultHtmlTemplate = `
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

async function renderTemplate(
  templatePath?: string,
  define?: Record<string, string>,
) {
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
    } catch (e) {}

    return templateHtml;
  }

  return defaultHtmlTemplate;
}

// 收集入口文件
async function collectEntrypoints(
  entryPoints: HtmlPluginOptions["entryPoints"],
  metafile?: esbuild.Metafile,
) {
  const filterEntryPoints = Object.entries(metafile?.outputs || {})
    .filter(([, value]) => {
      if (!value.entryPoint) {
        return false;
      }
      return entryPoints.includes(value.entryPoint);
    })
    .map((outputData) => {
      return { path: outputData[0], ...outputData[1] };
    });

  return filterEntryPoints;
}

function posixJoin(...paths: string[]): string {
  const joined = join(...paths);
  if (path.sep === "/") {
    return joined;
  }
  return joined.split(path.sep).join(path.posix.sep);
}

async function injectFiles(
  dom: JSDOM,
  collectedOutputFiles: any[],
  outdir: string,
) {
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

async function injectAssets(dom: JSDOM, assets: string[], outdir: string) {
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

export {
  renderTemplate,
  collectEntrypoints,
  injectFiles,
  injectAssets,
  posixJoin,
};
export type { HtmlPluginOptions };
