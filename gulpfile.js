const { assert } = require("console");
const gulp = require("gulp");
const copy = require("gulp-copy");
const { build } = require("tsup");

const compilePlugins = async () => {
  await build({
    entry: ["esbuildPlugin/htmlPlugin.ts"],
    outDir: "plugins",
    format: ["esm"],
    clean: true,
    // 避免tsup.config.js混入
    config: false,
  });
};

const mainCompile = async () => {
  try {
    const tsupConfig = require("./tsup.config.js");
    const HTMLPlugin = require("./plugins/htmlPlugin.mjs");
    await build({
      ...tsupConfig,
      esbuildPlugins: [
        HTMLPlugin.default([
          {
            outDir: "dist/popup",
            file: "index.html",
            entryPoints: ["src/popup/main.tsx"],
          },
          {
            outDir: "dist/options",
            file: "index.html",
            entryPoints: ["src/options/main.tsx"],
            assets: [
              "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css", // 将被注入到 head 中
            ],
          },
        ]),
      ],
    });
  } catch (e) {
    console.error("\x1b[31m%s\x1b[0m", "❌ [ tsup 编译失败 ]", e);
    throw e; // 抛出错误，终止 gulp 任务
  }
};


const copyOtherSrcFiles = async () => {
  return gulp
    .src(["src/icons/*", "src/manifest.json","src/sandbox.html"])
    .pipe(copy("dist", { prefix: 1 }));
};


const runBuild = gulp.series(mainCompile, copyOtherSrcFiles);

exports.dev = () => {
  gulp.watch("src/**/*", { ignoreInitial: false }, runBuild);
};

exports.buildPlugins = compilePlugins;
exports.default = runBuild;
