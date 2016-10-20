// Load plugins
var gulp = require('gulp'),
    blade2nunjucks = require('gulp-blade2nunjucks'),
    nunjucks = require('gulp-nunjucks'),
    notify = require('gulp-notify'),
    del = require('del');

// Styles
gulp.task('styles', function() {

});

// Scripts
gulp.task('scripts', function() {

});

// Images
gulp.task('images', function() {

});

// Templates
gulp.task('templates', function() {
  gulp.src(['resources/templates/**/*.blade.html'])
    .pipe(blade2nunjucks({
      ext: '.html'
    }))
    .pipe(gulp.dest('./resources/nunjucks/'));

  gulp.src(['resources/nunjucks/*.html'])
    .pipe(nunjucks.compile({
      name: function(file) {
        return file.relative.replace(/\\/, '\/')//Windows path.sep to Linux path.sep
      }
    }))
    .pipe(gulp.dest('./public/'))
    .pipe(notify({ message: 'templates complete' }));
});

// Clean
gulp.task('clean', function() {
  return del([ 'public/*.html', 'resources/nunjucks', 'public/assets/css', 'public/assets/js', 'public/assets/images']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images', 'templates');
});

// Watch
gulp.task('watch', function() {

  // Watch templates
  gulp.watch('resources/templates/**/*.blade.html', ['templates']);

  // Watch .less files
  //gulp.watch('src/assets/css/**/*.less', ['styles']);

  // Watch .js files
  //gulp.watch('src/assets/js/**/*.js', ['scripts']);

  // Watch image files
  //gulp.watch('src/assets/img/**/*', ['images']);

});
