const gulp = require('gulp');
const mocha = require('gulp-mocha');

const testBackend = 'src/backend/**/*.test.ts';

gulp.task('test-backend', () => {
    return gulp.src(testBackend)
        .pipe(mocha({ 
            require: ['ts-node/register'],
            exit: true
         }))
});



