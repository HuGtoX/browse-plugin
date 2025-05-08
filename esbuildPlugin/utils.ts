import esbuild from "esbuild";
import { fileURLToPath } from "url";
import { join, dirname, relative, parse } from "path";
import { template } from "lodash-es";
import { JSDOM } from "jsdom";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface HtmlPluginOptions {
  templatePath?: string; // 模板文件路径
  outputPath?: string; // 输出文件路径
  entryPoints: string[];
  file: string; // 输出文件名
  define?: Record<string, string>;
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
  define?: Record<string, string>
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
  metafile?: esbuild.Metafile
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

async function injectFiles(
  dom: JSDOM,
  collectedOutputFiles: any[],
  outdir: string
) {
  for (const outputFile of collectedOutputFiles) {
    console.log("-- [ outputFile ] --", outputFile);
    const ext = parse(outputFile.filepath).ext;
  }
}

export { renderTemplate, collectEntrypoints, injectFiles };
export type { HtmlPluginOptions };
