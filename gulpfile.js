var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
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
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var Cachebuster = require('gulp-cachebust');
var cachebust = new Cachebuster();
var env_json = require('./env.json')

var intervalMS = 500;

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

gulp.task('default', ['ts', 'html', 'css', 'lib', 'locale', 'fonts', 'ionicserve', 'img']);


gulp.task('ts', function () {
    var baseIdx = process.argv.indexOf('--base');
    var baseUrl = '';
    if (baseIdx !== -1) {
        baseUrl = process.argv[baseIdx + 1];
    }

    //var fb_api = fs.readFileSync("env.json", "utf8");
    //var fb_client_id = fb_api['auth']['FACEBOOK_CLIENTID'];
    var fb_client_id = env_json.auth['FACEBOOK_CLIENTID'];
    var google_client_id = env_json.auth['GOOGLE_CLIENTID'];

    var templateObject = {
        basePath: baseUrl || 'https://locator-app.com/api/v1',
        // TODO: refactor -> currently only for connection with online backend
        webPath: 'https://locator-app.com',
        facebookApiKey: fb_client_id,
        googleApiKey: google_client_id
    };

    var realtimeUrl = url.parse(templateObject.basePath);
    var port = parseInt(realtimeUrl.port, 10) + 1;
    templateObject.basePathRealtime = templateObject.basePath + '/r';


    var tsResult = gulp.src(['./www-develop/**/*.ts', '!./www-develop/lib/components/**/*.ts'])
        .pipe(template(templateObject))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProjectEmily));

    tsResult._events.error[0] = function (error) {
        if(!error || !error.__safety || !error.__safety.toString) {
            return;
        }
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

gulp.task('fonts', function () {
    gulp.src('./www-develop/**/*.ttf').pipe(gulp.dest('./www'));
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

gulp.task('watch', ['ts', 'html', 'css', 'fonts', 'lib', 'locale', 'img'], function () {
    gulp.watch('./www-develop/**/*.ts', {interval: intervalMS}, ['ts']);
    gulp.watch('./www-develop/**/*.css', {interval: intervalMS}, ['css']);
    gulp.watch('./www-develop/**/*.fonts', {interval: intervalMS}, ['fonts']);
    gulp.watch('./www-develop/**/*.html', {interval: intervalMS}, ['html']);
    gulp.watch('./www-develop/locale/**/*', {interval: intervalMS}, ['locale']);

    gulp.run('ionicserve');
});


gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('miniCss', function() {
    var target = gulp.src('./www-develop/index.html');
    var sources1 = gulp.src(['./www-develop/css/**/*.css', '!./www-develop/css/response.css'])
        .pipe(concat('css/all.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(cachebust.resources())
        .pipe(gulp.dest('./www'));

    return target.pipe(inject(sources1,  {ignorePath: 'www', addRootSlash: false})).pipe(gulp.dest('./www'));
});

gulp.task('compile', ['ts', 'html', 'lib', 'fonts', 'img', 'locale', 'miniCss']);


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
