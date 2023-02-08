const { src, dest, watch, parallel } = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const minify = require('gulp-clean-css');

const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const postcss = require('gulp-postcss')
const eslint = require("gulp-eslint");

let src_folder = './src/scss/*.scss';
let dest_folder = './static/css';

function generateCSS(cb) {
    src(src_folder)
    .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(minify())
        .pipe(postcss([ autoprefixer() ]))
    .pipe(sourcemaps.write('.'))
        .pipe(dest(dest_folder));
    cb();
}

function runLinter(cb) {
    return src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format()) 
        .pipe(eslint.failAfterError())
        .on('end', function() {
            cb();
        });
}


function watchFiles(cb) {
    watch(src_folder, generateCSS);
}

exports.css = generateCSS;
exports.watch = watchFiles;
exports.lint = runLinter;