const gulp = require("gulp");
const copy = require("gulp-copy");
const { build } = require("tsup");

const compilePlugins = async () => {
  await build({
    entry: ["esbuildPlugin/*.ts"],
    outDir: "plugins",
    format: ["esm"],
  });
};

// 编译 ts
const tsupCompile = async () => {
  const tsupConfig = require("./tsup.config");
  await build(tsupConfig);
};

// 复制 src 目录下除 js 和 ts 之外的文件
const copyOtherSrcFiles = async () => {
  return gulp
    .src(["src/**/*", "!src/**/*.{js,ts,tsx,css}"])
    .pipe(copy("dist", { prefix: 1 }));
};

const runBuild = gulp.series(tsupCompile, copyOtherSrcFiles);

exports.dev = () => {
  gulp.watch("src/**/*", { ignoreInitial: false }, runBuild);
};

exports.buildPlugins = compilePlugins;

exports.default = runBuild;
