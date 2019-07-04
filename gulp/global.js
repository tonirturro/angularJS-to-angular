const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('build', (done) => {
    runSequence( 'backend', 'frontend', () => done());
});

gulp.task('build-debug', (done) => {
    runSequence( 'backend', 'frontend-debug', () => done());
});
