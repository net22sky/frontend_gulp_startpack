const { src, dest, watch, parallel,series } = require("gulp");
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
const rimraf = require('rimraf');


const paths = {
	scss: './src/scss/*.scss',
	js: './src/js/*.js',
  ts: "src/**/*.ts",
  release: "./dist",
};


// Clean

function clean(cb) {
	//return del(['./dist'])
  rimraf.sync(paths.release);
  cb();
}


//const clean = await deleteAsync(['dist/*.*'], {dryRun: true});


// Ts task: concatenates and uglifies ts files to output.js

const convertTs = (cb) => {
  src(paths.ts)
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
    .pipe(dest(paths.release + "/js/"));
  cb();
};


// Sass task: compiles the style.scss file into style.css

const convertScss = (cb) => {
  src(paths.scss)
  .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(minify())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.release + "/css/"))
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


    // JS task: concatenates and uglifies JS files to script.js

    const jsTask = (cb) => {
  src([paths.js])
  .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(concat("script.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.release + "/js/"))
    .on("end", function () {
      cb();
    });
};

const watchFiles = (cb) => {
  watch(paths.scss, convertScss);
};

exports.clean = clean;
exports.css = convertScss;
exports.watch = watchFiles;
exports.lint = runLinter;
exports.ts = series(clean,convertTs);
exports.js = jsTask;
exports.build = series(clean, parallel(convertTs, convertScss, jsTask));
