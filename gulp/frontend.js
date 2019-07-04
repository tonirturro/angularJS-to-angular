const path = require('path');
const gulp = require('gulp');
const gettext = require('gulp-angular-gettext');
const exec = require('child_process').exec;
const tslint = require('gulp-tslint');
const runSequence = require('run-sequence');
const electron = require('electron-connect').server.create({
  path: 'dist'
});

const localizationSrcFolder = path.resolve(__dirname, '../localization/*.po')
const frontendFolder =  path.resolve(__dirname, '../src/frontend');
const frontEndSources = path.resolve(frontendFolder, 'App');
const frontEndTSFiles = path.resolve(frontEndSources, '**/*.ts');
const frontEndAllFiles = path.resolve(frontEndSources, '**/*.*');
const appOutput = path.resolve(__dirname, '../dist');

gulp.task('translations', () => {
  return gulp.src(localizationSrcFolder)
  .pipe(gettext.compile({
      format: 'json'
  }))
  .pipe(gulp.dest(path.resolve(appOutput, 'translations')));
});

gulp.task('angular-app-prod', (cb) => {
  exec('ng build --prod="true"', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('angular-app-dev', (cb) => {
  exec('ng build', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('angular-app-dev-watch', (done) => {
    gulp.watch(frontEndAllFiles, () => {
      console.log('Rebuild...');
    });
});

gulp.task('tslint',  () => {
  gulp.src(frontEndTSFiles)
    .pipe(tslint({
      formatter: 'stylish'
    }))
    .pipe(tslint.report({
      emitError: true
    }))
});

gulp.task('frontend', (done) => {
  runSequence('tslint', 'angular-app-prod', 'translations', done);
});

gulp.task('frontend-debug', (done) => {
  runSequence('angular-app-dev', 'translations', done);
});

gulp.task('watch-frontend', (done) => {
    runSequence( 'backend', 'angular-app-dev','translations', 'electron-watch', done);
});

gulp.task('electron-watch', () => {
  electron.start('--remote-debugging-port=9222');
  gulp.watch(frontEndAllFiles, () => {
    electron.stop();
    console.log('Rebuild...');
    runSequence('angular-app-dev', 'translations', () => {
      electron.start('--remote-debugging-port=9222');
    });
  });
});

