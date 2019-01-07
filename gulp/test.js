const path = require('path');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const runSequence = require('run-sequence');
const KarmaServer = require('karma').Server;

const testBackend = path.resolve(__dirname, '../src/backend/**/*.test.ts');
const karmaConfig = path.resolve(__dirname, '../test/karma.conf.js');

gulp.task('test-backend', () => {
    return gulp.src(testBackend)
        .pipe(mocha({ 
            require: ['ts-node/register']
         }))
});

gulp.task('test-frontend', ['views', 'watch-templates'], (done) => {
    new KarmaServer({
        configFile: karmaConfig
    }, done).start();
});

gulp.task('test-frontend-single', ['views'], (done) => {
    new KarmaServer({
        configFile: karmaConfig,
        singleRun: true
    }, done).start();
});

gulp.task('test-all', () => {
    return runSequence('test-frontend-single', 'test-backend');
});



