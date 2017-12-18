"use strict";
var gulp = require('gulp'),
    changed = require('gulp-changed');

/*Images*/
gulp.task('images', ()=>{
    let src = 'src/images-src/**/*.{jpg,png,gif,ico}';
    let tar = 'src/images';

  const imagemin = require('gulp-imagemin');
  gulp.src(src)
    .pipe(changed(tar))
    .pipe(imagemin([
      require('imagemin-pngquant')(),
      require('imagemin-jpegtran')({quality:70}),
      require('imagemin-gifsicle')({optimizationLevel:2}),
    ]))
    .pipe(gulp.dest(tar));
});
gulp.task('default',['images'])
