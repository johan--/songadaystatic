var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var gulp = require("gulp")


gulp.task("default", function () {
  return gulp.src("./app/partials/*.html")
    .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    }))
    .pipe(ngHtml2Js({
        moduleName: "partials",
        prefix: "/partials"
    }))
    .pipe(concat("partials.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/partials"));
});
