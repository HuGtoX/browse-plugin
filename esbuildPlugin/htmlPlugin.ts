import esbuild from "esbuild";
import {
  renderTemplate,
  collectEntrypoints,
  injectFiles,
  posixJoin,
  injectAssets,
} from "./utils";
import type { HtmlPluginOptions } from "./utils";
import fs from "fs/promises";
import * as path from "path";
import { JSDOM } from "jsdom";

// 定义一个 esbuild 插件
const htmlPlugin = (options: HtmlPluginOptions[]): esbuild.Plugin => {
  if (!Array.isArray(options)) {
    throw new TypeError(
      `htmlPlugin options 必须为数组类型，当前传入类型：${typeof options}`,
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
              assets,
            } = options[i];
            // 输出目录
            const outdir = outDir || build.initialOptions.outdir || "dist";

            // 生成HTML模板
            const templateContent = await renderTemplate(templatePath, define);

            // 获取所有输出文件
            const collectedEntrypoints = await collectEntrypoints(
              entryPoints,
              result.metafile,
            );

            let collectedOutputFiles: (esbuild.Metafile["outputs"][string] & {
              path: string;
            })[] = [];

            // 将css关联文件放到收集文件中
            for (const entrypoint of collectedEntrypoints) {
              if (!entrypoint) {
                throw new Error(`Found no match for ${entryPoints}`);
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

            // 如果有额外的 assets，注入它们
            if (Array.isArray(assets) && assets.length > 0) {
              await injectAssets(dom, assets, outdir);
            }

            const out = posixJoin(outdir, file);
            await fs.mkdir(path.dirname(out), { recursive: true });
            await fs.writeFile(out, dom.serialize());

            const finishTime = new Date(
              Date.now() - startTime,
            ).getMilliseconds();

            console.log(
              "\x1b[32m%s\x1b[0m",
              "✅ [ htmlPlugin create success ] after " + finishTime + "ms",
            );
          }
        } catch (e) {
          throw new Error(`\x1b[31m❌ [ htmlPlugin 构建失败 ]\x1b[0m ${e}`);
        }
      });
    },
  };
};

export default htmlPlugin;
