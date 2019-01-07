const path = require('path');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const del = require('del');
const appOutput = path.resolve(__dirname, '../dist');

gulp.task('clean-app', () => del(appOutput));

gulp.task('buildAll', (done) => {
    runSequence('clean-app', ['frontend', 'backend'], () => done());
});
