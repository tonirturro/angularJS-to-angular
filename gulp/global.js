const gulp = require('gulp');

gulp.task('build', gulp.series('backend', 'frontend'));

gulp.task('build-debug', gulp.series('backend', 'frontend-debug'));
