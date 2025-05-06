const gulp = require('gulp');
const copy = require('gulp-copy');

// 复制 src 目录下除 js 和 ts 之外的文件
const copyOtherSrcFiles = () => {
    return gulp.src(['src/**/*', '!src/**/*.{js,ts,tsx}'])
        .pipe(copy('dist', { prefix: 1 }));
};

// 组合所有任务
const copyAll = gulp.parallel(copyOtherSrcFiles);

exports.copyAll = copyAll;