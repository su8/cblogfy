var gulp = require('gulp');
var uncss = require('gulp-uncss');

gulp.task('default', function () {
    return gulp.src('../css/bootstrap-theme1.min.css')
        .pipe(uncss({
            html: ['../index.html']
        }))
        .pipe(gulp.dest('./out'));
});
