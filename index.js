import { fileURLToPath } from "url";
import { join, dirname } from "path";
import { template } from "lodash-es";
import fs from "fs/promises";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
        }
        catch (e) { }
        return templateHtml;
    }
    return defaultHtmlTemplate;
}
// 定义一个 esbuild 插件
const htmlPlugin = async (options) => {
    const startTime = Date.now();
    const { templatePath, file } = options;
    const data = await renderTemplate(templatePath, options.define);
    await fs.writeFile(file, data, "utf8");
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
