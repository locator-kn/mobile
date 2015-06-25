var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var ts = require('gulp-typescript');
var path = require('path');
var notifier = require('node-notifier');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var shell = require('gulp-shell');
var template = require('gulp-template');
var url = require('url');

var typescript15 = require('typescript');


var tsProjectEmily = ts.createProject({
    declarationFiles: true,
    noExternalResolve: false,
    module: 'commonjs',
    target: 'ES5',
    noEmitOnError: false,
    out: 'js/app.js',
    typescript: typescript15
});

gulp.task('default', ['ts', 'html', 'css', 'lib', 'locale', 'ionicserve', 'img']);


gulp.task('ts', function () {
    var baseIdx = process.argv.indexOf('--base');
    var baseUrl = '';
    if (baseIdx !== -1) {
        baseUrl = process.argv[baseIdx + 1];
    }

    var templateObject = {
        basePath: baseUrl || 'http://locator.in.htwg-konstanz.de/api/v1'
    };

    var realtimeUrl = url.parse(templateObject.basePath);
    var port = parseInt(realtimeUrl.port, 10) + 1;
    templateObject.basePathRealtime = templateObject.basePath + '/r';


    var tsResult = gulp.src(['./www-develop/**/*.ts', '!./www-develop/lib/components/**/*.ts'])
        .pipe(template(templateObject))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProjectEmily));

    tsResult._events.error[0] = function (error) {
        notifier.notify({
            'title': 'Compilation error',
            'message': error.__safety.toString(),
            sound: true
        });
    };
    return merge([
        tsResult.dts.pipe(gulp.dest('./www/definitions')),
        tsResult.js.pipe(gulp.dest('./www'))
    ]);
});

gulp.task('locale', function () {
    gulp.src('./www-develop/locale/**/*').pipe(gulp.dest('./www/locale'));
});

gulp.task('ionicserve', shell.task([
    'ionic serve'
]));

gulp.task('css', function () {
    gulp.src('./www-develop/**/*.css').pipe(gulp.dest('./www'));
});

gulp.task('html', function () {
    gulp.src('./www-develop/**/*.html').pipe(gulp.dest('./www'));
});

gulp.task('lib', function () {
    gulp.src('./www-develop/lib/**/*').pipe(gulp.dest('./www/lib'));
});

gulp.task('img', function () {
    gulp.src('./www-develop/images/**/*').pipe(gulp.dest('./www/images'));
});

gulp.task('watch', ['ts', 'html', 'css', 'lib', 'locale', 'img'], function () {
    gulp.watch('./www-develop/**/*.ts', ['ts']);
    gulp.watch('./www-develop/**/*.css', ['css']);
    gulp.watch('./www-develop/**/*.html', ['html']);
    gulp.watch('./www-develop/locale/**/*', ['locale']);

    gulp.run('ionicserve');
});


gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});


gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
