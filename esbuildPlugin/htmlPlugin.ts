import esbuild from "esbuild";
import { renderTemplate, collectEntrypoints, injectFiles } from "./utils";
import type { HtmlPluginOptions } from "./utils";
import { JSDOM } from "jsdom";

// 定义一个 esbuild 插件
const htmlPlugin = (options: HtmlPluginOptions): esbuild.Plugin => {
  return {
    name: "html-create-plugin",
    setup(build) {
      build.onEnd(async (result) => {
        const startTime = Date.now();
        const { templatePath, file, outputPath } = options;
        const outdir = outputPath || build.initialOptions.outdir || "dist";

        // 生成HTML模板
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
    },
  };
};

export default htmlPlugin;
