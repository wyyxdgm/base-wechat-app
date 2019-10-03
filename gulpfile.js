var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify-es').default;
var htmlminify = require("gulp-html-minify");
var cssminify = require("gulp-clean-css");
var changed = require("gulp-changed");
var postcss = require('gulp-postcss');
var cssBase64 = require('gulp-base64');
var autoprefixer = require('autoprefixer');
var clean = require('gulp-clean');
const mocha = require('gulp-mocha');
var fs = require('fs');
var projectConfig = fs.existsSync('project.json') ? require('./project') : {};
const DIST = projectConfig.buildPath || 'dist';
require('./lab/lab');
gulp.task('watch', function() {
    gulp.watch('src/**', ['build:style', 'cp:common']);
});
var useChanged = false;

function buildStyle(src, needCssmin) {
    let line;
    line = gulp.src(src, {
        base: "src"
    });
    line = line.pipe(less())
    line = line.pipe(cssBase64({
        // baseDir: '',
        // extensions: ['svg', 'png', /\.jpg#datauri$/i],
        // exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
        maxImageSize: 800 * 1024, // bytes
        debug: true
    }))
    line = line.pipe(postcss([autoprefixer(['iOS >= 8', 'Android >= 4.1'])]));
    if (needCssmin) line = line.pipe(cssminify());
    line = line.pipe(rename(function(path) {
        path.extname = '.wxss';
    }));
    if (useChanged) line = line.pipe(changed(DIST))
    line = line.pipe(gulp.dest(DIST));
    return line;
}

function cpFiles(src) {
    let line;
    line = gulp.src(src, {
        base: "src"
    });
    if (useChanged) line = line.pipe(changed(DIST))
    line = line.pipe(gulp.dest(DIST));
    return line;
}
gulp.task('clean', function() {
    let line = gulp.src([`${DIST}/**`], {
        read: false
    });
    line = line.pipe(clean({
        force: true
    }));
    return line;
});
gulp.task('compress', function(cb) {
    let line;
    line = gulp.src(['src/app.js', 'src/**/*.js', 'src/**/**/*.js', '!src/pages/reservation/index.js'])
        .pipe(uglify());
    if (useChanged) line = line.pipe(changed(DIST))
    line = line.pipe(gulp.dest(DIST));
    return line;
});
gulp.task('htmlminify', function(cb) {
    let line;
    line = gulp.src(['src/**/**/*.wxml'])
        .pipe(htmlminify({
            collapseWhitespace: true,
            removeComments: true,
            keepClosingSlash: true
        }));
    if (useChanged) line = line.pipe(changed(DIST))
    line = line.pipe(gulp.dest(DIST));
    return line;
});
gulp.task('build:style', function() {
    buildStyle(['src/assets/style/*.wxss', 'src/assets/style/**/*.wxss', 'src/assets/style/**/**/*.wxss', 'src/pages/**/*.wxss', 'src/*.wxss'], true);
});
gulp.task('build:style:dev', function() {
    buildStyle(['src/assets/style/*.wxss', 'src/assets/style/**/*.wxss', 'src/assets/style/**/**/*.wxss', 'src/pages/**/*.wxss', 'src/*.wxss']);
});
gulp.task('cp:common', function() {
    cpFiles(['src/app.*', '!src/app.wxss', '!src/app.js', 'src/pages/reservation/index.js', 'src/assets/images/include/**']); //, 'src/assets/images/**'
});
gulp.task('cp:common:dev', function() {
    cpFiles(['src/app.*', 'src/pages/**', '!src/pages/**/*.wxss', 'src/utils/**', 'src/assets/images/include/**']); //'src/assets/images/**'
});

gulp.task('build:common', ['build:style', 'cp:common', 'compress', 'htmlminify']);
gulp.task('build:common:dev', ['build:style:dev', 'cp:common:dev']);
['dev', 'staging', 'prod'].forEach(function(envname, index) {
    gulp.task(`build:env:${envname}`, function() {
        console.log(`---------------------build:env:${envname}`);
        gulp.src([`conf/config-${envname}.js`], {
                base: "src"
            })
            .pipe(rename('config.js'))
            .pipe(uglify())
            .pipe(gulp.dest(DIST));
    });
    if (envname !== 'dev') {
        gulp.task(envname, ['build:common', `build:env:${envname}`]);
    } else {
        gulp.task(envname, ['build:common:dev', `build:env:${envname}`]);
    }
    gulp.task(`watch:${envname}`, function() {
        /**
         * wx bug
         * 现在的小程序工具支持模式:
         * 如：wxss A 中引入 wxss B，如果修改了B，gulp会同步B到dist目录
         * 结果小程序工具识别不了这种包含关系，只有A被修改了才会reload样式
         * 结论：对于有引用的不适合设置useChanged为true。
         */
        useChanged = true;
        gulp.watch('src/**', [envname]);
    });
});

gulp.task('test', () =>
    gulp.src('test/*.js', {
        read: false
    })
    .pipe(mocha({
        reporter: 'nyan',
        exit: true
    }))
);

gulp.task('default', ['watch:dev']);