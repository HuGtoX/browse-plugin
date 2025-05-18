import esbuild from "esbuild";
import {
  renderTemplate,
  collectEntrypoints,
  injectFiles,
  posixJoin,
} from "./utils";
import type { HtmlPluginOptions } from "./utils";
import fs from "fs/promises";
import * as path from 'path';
import { JSDOM } from "jsdom";

// 定义一个 esbuild 插件
const htmlPlugin = (options: HtmlPluginOptions): esbuild.Plugin => {
  return {
    name: "html-create-plugin",
    setup(build) {
      build.onEnd(async (result) => {
        const startTime = Date.now();
        const { templatePath, file, outputPath } = options;
        try {
          // 输出目录
          const outdir = outputPath || build.initialOptions.outdir || "dist";

          // 生成HTML模板
          const templateContent = await renderTemplate(
            templatePath,
            options.define
          );

          // 获取所有输出文件
          const collectedEntrypoints = await collectEntrypoints(
            options.entryPoints,
            result.metafile
          );

          let collectedOutputFiles: (esbuild.Metafile["outputs"][string] & {
            path: string;
          })[] = [];

          // 将css关联文件放到收集文件中
          for (const entrypoint of collectedEntrypoints) {
            if (!entrypoint) {
              throw new Error(`Found no match for ${options.entryPoints}`);
            }
            const relatedOutputFiles = new Map();
            relatedOutputFiles.set(entrypoint.path, entrypoint);
            if (entrypoint?.cssBundle) {
              relatedOutputFiles.set(entrypoint.cssBundle, {
                path: entrypoint?.cssBundle,
              });
            }
            collectedOutputFiles = [
              ...collectedOutputFiles,
              ...relatedOutputFiles.values(),
            ];
          }

          const dom = new JSDOM(templateContent);

          // 往HTML模板中注入文件
          await injectFiles(dom, collectedOutputFiles, outdir).catch((e) => {
            console.error(e);
          });

          const out = posixJoin(outdir, options.file);
          await fs.mkdir(path.dirname(out), { recursive: true });
          await fs.writeFile(out, dom.serialize());

          const finishTime = new Date(Date.now() - startTime).getMilliseconds();

          console.log(
            "\x1b[32m%s\x1b[0m",
            "✅ [ htmlPlugin create success ] after " + finishTime + "ms"
          );
        } catch (e) {
          console.log("-- [ e ] --", e);
        }
      });
    },
  };
};

export default htmlPlugin;
