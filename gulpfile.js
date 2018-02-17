(function(){
  'use strict';
  var gulp = require('gulp'),
      nunjucksRender = require('gulp-nunjucks-render'),
      nunjucks = require('gulp-nunjucks'),
      notify = require('gulp-notify'),
      del = require('del'),
      responsive = require('gulp-responsive'),
      tinypng = require('gulp-tinypng'),
      svgSprite = require('gulp-svg-sprites'),
      rev = require('gulp-rev'),
      sass = require('gulp-sass'),
      argv = require('yargs').argv,
      addsrc = require('gulp-add-src'),
      svgmin = require('gulp-svgmin'),
      connect = require('gulp-connect'),
      open = require('gulp-open'),
      concat = require('gulp-concat'),
      sequence = require('run-sequence'),
      uglify = require('gulp-uglify'),
      filter = require('gulp-filter'),
      cleanCss = require('gulp-clean-css'),
      sourcemaps = require('gulp-sourcemaps'),
      autoprefixer = require('gulp-autoprefixer'),
      imagemin = require('gulp-imagemin'),
      revDistClean = require('gulp-rev-dist-clean'),
      first = require('gulp-first')
  ;

  // Settings
  var mode = typeof argv.mode !== typeof undefined ? argv.mode : 'static'; // ci, laravel, static TODO Craft
  var liveReload = typeof argv.liveReload !== typeof liveReload;
  var production = typeof argv.production !== typeof undefined;

  var imageminConfig = [
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 1}),
    imagemin.svgo({
      plugins: [
        {removeViewBox: false},
        {cleanupIDs: false}
      ]
    })
  ];

  // Vars used in tasks
  var paths = {};
  paths.root = '';
  paths.base = paths.root;
  paths.resources = paths.base + 'resources/';
  paths.assets = paths.resources + 'assets/';
  paths.css = paths.assets + 'css/';
  paths.sass = paths.assets + 'sass/';
  paths.js = paths.assets + 'js/';
  paths.nunjucks = paths.resources + 'nunjucks/';
  paths.images = paths.assets + 'images/';
  paths.svg = paths.images + 'svg/';
  paths.fonts = paths.assets + 'fonts/';

  var dist = {base: paths.root + 'static/'};
  if (mode === 'laravel') dist.base = paths.root + 'public/';
  if (mode === 'ci') dist.base = paths.root + ''; // Assets in root
  dist.assets = dist.base + 'assets/';
  if (mode === 'laravel') dist.assets = dist.base + 'build/';
  dist.css = dist.assets + 'css/';
  dist.js = dist.assets + 'js/';
  dist.images = dist.assets + 'images/';
  dist.fonts = dist.assets + 'fonts/';
  dist.html = dist.base;
  dist.revManifest = dist.assets; // CI
  if (mode === 'laravel') dist.revManifest = dist.base;
  if (mode === 'static') dist.revManifest = dist.base;

  // Templates
  gulp.task('templates', function () {
    gulp.src([paths.nunjucks + '**/*.+(html|nunjucks)'])
      .pipe(nunjucksRender({
        path: [paths.nunjucks]
      }))
      .pipe(gulp.dest(dist.html))
      .pipe(notify({message: 'Templates rendered'}));
  });

  // Versioning
  gulp.task('version-scripts-styles', function () {
    var fJs = filter(['**/*.js'], {restore: true});
    var fCss = filter(['**/*.css'], {restore: true});
    var base = dist.base;
    if (mode === 'ci') base = dist.assets;
    return gulp.src([
        dist.js + 'app.js',
        dist.js + 'head.js',
        dist.js + 'contact.js',
        dist.css + 'style.css'
      ], {base: base})
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(fJs)
      .pipe(uglify())
      .pipe(fJs.restore)
      .pipe(fCss)
      .pipe(cleanCss({compatibility: 'ie9'}))
      .pipe(fCss.restore)
      .on('error', function(err) {
        console.error('Error in clean CSS task', err.toString());
      })
      .pipe(rev())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(mode === 'laravel' ? dist.base : dist.assets))
      .pipe(rev.manifest(dist.revManifest + 'rev-manifest.json', {
        base: dist.revManifest,
        merge: true
      }))
      .pipe(gulp.dest(dist.revManifest))
      .pipe(first()) // Filter so notification is only shown once
      .pipe(notify({message: 'Assets versioned'}))
    ;
  });

  gulp.task('version-images', function() {
    var fPng = filter(['**/*.png'], {restore: true});
    var base = dist.base;
    if (mode === 'ci') base = dist.assets;
    return gulp
      .src(dist.images + '**/*', {base: base})
      .pipe(fPng)
      .pipe(imagemin(imageminConfig))
      .pipe(fPng.restore)
      .pipe(rev())
      .pipe(gulp.dest(mode === 'laravel' ? dist.base : dist.assets))
      .pipe(rev.manifest(dist.revManifest + 'rev-manifest.json', {
        base: dist.revManifest,
        merge: true
      }))
      .pipe(gulp.dest(dist.revManifest))
      .pipe(first())
      .pipe(notify({message: 'Images versioned'}))
    ;
  });

  gulp.task('version', function(cb) {
    if (production && mode !== 'static') {
      sequence([
        'version-scripts-styles'
        , 'version-images'
      ], cb);
    } else {
      cb();
    }
  });

  // Clean
  gulp.task('clean', function () {
    // TODO check for all envs
    //return del([dist.base]);
    try {
      return gulp.src([dist.assets + '**/*'], {read: false})
        .pipe(revDistClean(dist.revManifest + 'rev-manifest.json', {keepOriginalFiles: true, keepRenamedFiles: false}))
        .pipe(first())
        .pipe(notify({message: 'Old files cleaned'}))
    } catch (e) {
      return gulp;
    }
  });

  /* Tiny png api key: https://tinypng.com/developers
   * free plan = max 500 images/month
   */
  gulp.task('retina-images', function () {
    return gulp
      .src(paths.images + 'test-images/**/*')
      .pipe(responsive({
          '*.{png,jpg}': [{
            width: '100%',
            suffix: '@2x'
          }, {
            width: '50%',
            suffix: ''
          }]
        },
        {
          quality:70,
          progressive: true
        }))
      .pipe(tinypng('YOUR_API_CODE'))
      .pipe(gulp.dest(paths.images))
      ;
  });

  // Svg sprite
  gulp.task('sprites', function () {
    return gulp
      .src(paths.svg + '*.svg')
      .pipe(svgSprite({
        mode: 'symbols',
        svgId: 'icon-%f'
      }))
      .pipe(gulp.dest(paths.assets + 'svg-sprite/'));
  });

  // Scripts head
  gulp.task('scripts-head', function() {
    return gulp
      .src([
        paths.js + 'libs/modernizr.min.js'
      ])
      .pipe(sourcemaps.init())
      .pipe(concat('head.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dist.js))
      .pipe(filter(['**/*.js'])) // Filter so notification is only shown once
      .pipe(notify({message: 'Scripts head merged'}))
    ;
  });

  // Scripts body
  gulp.task('scripts-body', function() {
    // TODO ES6 (Babel)
    return gulp
      .src([
        paths.js + 'libs/jquery.min.js',
        paths.js + 'plugins.js',
        paths.js + 'esign.js'
      ])
      .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dist.js))
      .pipe(filter(['**/*.js'])) // Filter so notification is only shown once
      .pipe(notify({message: 'Scripts body merged'}))
    ;
  });

  // Scripts contact
  gulp.task('scripts-contact', function() {
    return gulp
      .src([
        paths.js + 'libs/validation/languages/jquery.validationEngine-nl.js',
        paths.js + 'libs/validation/jquery.validationEngine.js',
        paths.js + 'googlemaps-styles.js',
        paths.js + 'contact.js'
      ])
      .pipe(sourcemaps.init())
      .pipe(concat('contact.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dist.js))
      .pipe(filter(['**/*.js'])) // Filter so notification is only shown once
      .pipe(notify({message: 'Scripts contact merged'}))
    ;
  });

  // Styles
  gulp.task('styles', function() {
    return gulp
      .src([paths.sass + 'style.scss']) // compile sass
      .pipe(addsrc([])) // other css files (plugins, libs)
      .pipe(sass())
      .pipe(sourcemaps.init())
      .pipe(autoprefixer({
        browsers: ['> 1%', 'Last 2 versions', 'IE 9'],
        cascade: false
      }))
      .pipe(concat('style.css'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dist.css))
      .pipe(filter(['**/*.css'])) // Filter so notification is only shown once
      .pipe(notify({message: 'Styles merged'}));
  });

  // Svg
  //{ plugins: [{ convertPathData: false }, { mergePaths: false }, { removeUnknownsAndDefaults: false }] }
  gulp.task('svg', function() {
    return gulp
      .src(paths.images + '**/*.svg')
      .pipe(svgmin())
      .pipe(gulp.dest(dist.images))
      .pipe(notify({message: 'SVGs minified'}));
  });


  // Images
  gulp.task('images', function() {
    return gulp
      .src(paths.images + '**/*')
      .pipe(gulp.dest(dist.images))
      .pipe(first())
      .pipe(notify({message: 'Images copied'}));

  });

  // Fonts
  gulp.task('fonts', function() {
    return gulp
      .src(paths.fonts + '**/*')
      .pipe(gulp.dest(dist.fonts))
      .pipe(notify({message: 'Fonts copied'}));
      // TODO check if other filetypes can be auto-generated
  });

  gulp.task('scripts', function(cb) {
    return sequence(['scripts-head', 'scripts-body', 'scripts-contact'], cb);
    // TODO ES6
  });

  gulp.task('connect', function () {
    return connect.server({
      root: [ dist.base ],
      livereload: true,
      port:'3000'
    });
  });

  gulp.task('open', function () {
    // TODO other environments
    return gulp.src(dist.base + 'index.html').pipe(open({ uri: 'http://localhost:3000/index.html'}));
  });

  gulp.task('watch-scripts', function() {
    return gulp.watch(paths.js + '**/*.js', ['scripts']);
  });

  gulp.task('watch-styles', function() {
    return gulp.watch([paths.css + '**/*', paths.sass + '**/*'], ['styles']);
  });

  gulp.task('watch-nunjucks', function() {
    return gulp.watch(paths.nunjucks + '**/*', ['templates']);
  });

  gulp.task('watch-images', function() {
    return gulp.watch([paths.images + '**/*', '!' + paths.images + '**/*.svg'], ['images']);
  });

  gulp.task('watch-svgs', function() {
    return gulp.watch(paths.images + '**/*.svg', ['svg']);
  });

  gulp.task('watch-fonts', function() {
    return gulp.watch(paths.fonts + '**/*', ['fonts']);
  });

  gulp.task('watcher', function (cb) {
    // TODO watcher for Laravel's blade files, watcher for CI views
    return sequence(
      ['watch-scripts', 'watch-styles', 'watch-nunjucks', 'watch-images', 'watch-svgs', 'watch-fonts'], cb
    );
  });

  gulp.task('build', function(cb) {
    var tasks = ['images', 'svg', 'scripts', 'styles', 'fonts'];
    if (mode === 'static') tasks.push('templates');
    sequence('clean', tasks, 'version', cb);
  });

  gulp.task('server', [ 'watch', 'connect', 'open' ]);

  gulp.task('watch', function(cb) {
    sequence('build', 'watcher', liveReload ? ['connect', 'open'] : [], cb);
  });

  gulp.task('default', function() {
    gulp.start('build');
  });

})();
