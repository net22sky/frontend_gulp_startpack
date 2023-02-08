const gulp = require('gulp'); 
const concatCss = require('gulp-concat-css'); 
const cssNano = require('gulp-cssnano') 
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');

gulp.task('compilescss', function() {
    gulp.src('./src/css/*.scss')
        .pipe(sass())
        .pipe(prefix())
        .pipe(minify())
        .pipe(rename(function (path) {
            return {
            dirname: path.dirname + "",
            basename: path.basename + ".min",
            extname: ".css"
            };
        }))
        .pipe(gulp.dest('./static/css'))
});

gulp.task('watch',function(){
    gulp.watch('./src/css/*.scss', compilescss)
});