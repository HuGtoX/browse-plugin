import { fileURLToPath } from "url";
import { join, dirname } from "path";
import { template } from "lodash-es";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface HtmlPluginOptions {
  templatePath?: string; // 模板文件路径
  outputPath?: string; // 输出文件路径
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

// 定义一个 esbuild 插件
const htmlPlugin = async (options: HtmlPluginOptions) => {
  const startTime = Date.now();
  const { templatePath, file } = options;
  const templateContent = await renderTemplate(templatePath, options.define);
  await fs.writeFile(file, templateContent, "utf8");
  const finishTime = new Date(Date.now() - startTime).getMilliseconds();
  console.log("-- [ finishTime ] --", finishTime + "ms");
};

htmlPlugin({
  templatePath: "src/popup/index.html",
  file: "index.html",
  define: {
    value: "inject title",
  },
});
