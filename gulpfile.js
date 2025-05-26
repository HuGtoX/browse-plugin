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

// 编译 ts
const tsupCompile = async () => {
  try {
    const tsupConfig = require("./tsup.config.js");
    const HTMLPlugin = require("./plugins/htmlPlugin.mjs");
    await build({
      ...tsupConfig,
      esbuildPlugins: [
        HTMLPlugin.default([
          {
            outputPath: "dist/popup",
            file: "index.html",
            entryPoints: ["src/popup/main.tsx"],
          },
          {
            outputPath: "dist/options",
            file: "index.html",
            entryPoints: ["src/options/main.tsx"],
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
    .src(["src/icons/*", "src/manifest.json"])
    .pipe(copy("dist", { prefix: 1 }));
};

const runBuild = gulp.series(tsupCompile, copyOtherSrcFiles);

exports.dev = () => {
  gulp.watch("src/**/*", { ignoreInitial: false }, runBuild);
};

exports.buildPlugins = compilePlugins;
exports.default = runBuild;
