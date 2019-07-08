const gulp = require('gulp');
const exec = require('child_process').exec;

gulp.task('backend', (cb) => {
    exec('ng run backend:build', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
      });    
});
