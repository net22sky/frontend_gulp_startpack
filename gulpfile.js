const { src, dest, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const minify = require("gulp-clean-css");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const eslint = require("gulp-eslint");

const srcFolder = "./src/scss/*.scss";
const targetFolder = "./static/css";

const convertScss = (cb) => {
  src(srcFolder)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(minify())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest(targetFolder));
  cb();
};

const runLinter = (cb) =>
  src(["**/*.js", "!node_modules/**"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on("end", function () {
      cb();
    });

const watchFiles = (cb) => {
  watch(srcFolder, convertScss);
};

exports.css = convertScss;
exports.watch = watchFiles;
exports.lint = runLinter;
