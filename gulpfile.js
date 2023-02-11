const { src, dest, watch, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const minify = require("gulp-clean-css");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const eslint = require("gulp-eslint");
const concat = require("gulp-concat");
const typeScript = require("gulp-typescript");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const plumber = require('gulp-plumber');


const srcFolder = "./src/scss/*.scss";
const targetFolder = "./dist/css";
const srcTs = "src/**/*.ts";
const srcJsFolder = "./src/js/*.js";

const convertTs = (cb) => {
  src(srcTs)
  .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      typeScript({
        noImplicitAny: true,
        removeComments: true,
        outFile: "output.js",
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest(targetFolder + "/js/"));
  cb();
};

const convertScss = (cb) => {
  src(srcFolder)
  .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(minify())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest(targetFolder + "/css/"))
    .on("end", function () {
      cb();
    });
};

const runLinter = (cb) =>
  src(["**/*.js", "!node_modules/**"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on("end", function () {
      cb();
    });

const jsTask = (cb) => {
  src([srcJsFolder])
  .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(dest(targetFolder + "/js/"))
    .on("end", function () {
      cb();
    });
};

const watchFiles = (cb) => {
  watch(srcFolder, convertScss);
};

exports.css = convertScss;
exports.watch = watchFiles;
exports.lint = runLinter;
exports.ts = convertTs;
exports.js = jsTask;
exports.build = parallel(convertTs, convertScss, jsTask);
