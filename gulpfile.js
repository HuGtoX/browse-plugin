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
  const tsupConfig = require("./tsup.config");
  const HTMLPlugin = require("./plugins/htmlPlugin.mjs");
  await build({
    ...tsupConfig,
    esbuildPlugins: [
      HTMLPlugin.default({
        outputPath: "dist/popup",
        file: "index.html",
        entryPoints: ["src/main.tsx"],
      }),
    ],
  });
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
