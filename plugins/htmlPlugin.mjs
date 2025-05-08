// esbuildPlugin/utils.ts
import { fileURLToPath } from "url";
import { join, dirname } from "path";
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
async function injectFiles(dom, collectedOutputFiles, outdir) {
  for (const outputFile of collectedOutputFiles) {
    console.log("-- [ outputFile ] --", outputFile);
  }
}

// esbuildPlugin/htmlPlugin.ts
import { JSDOM } from "jsdom";
var htmlPlugin = (options) => {
  return {
    name: "html-create-plugin",
    setup(build) {
      build.onEnd(async (result) => {
        const startTime = Date.now();
        const { templatePath, file, outputPath } = options;
        const outdir = outputPath || build.initialOptions.outdir || "dist";
        const templateContent = await renderTemplate(
          templatePath,
          options.define
        );
        const collectedOutputFiles = await collectEntrypoints(
          options.entryPoints,
          result.metafile
        );
        const dom = new JSDOM(templateContent);
        await injectFiles(dom, collectedOutputFiles, outdir);
        const finishTime = new Date(Date.now() - startTime).getMilliseconds();
        console.log("-- [ finishTime ] --", finishTime + "ms");
      });
    }
  };
};
var htmlPlugin_default = htmlPlugin;
export {
  htmlPlugin_default as default
};
