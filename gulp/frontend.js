const gulp = require('gulp');
const gettext = require('gulp-angular-gettext');
const tslint = require('gulp-tslint');
const electron = require('electron-connect').server.create({
  path: 'dist'
});
const { BuildLauncher } = require('./buildLauncher');

const localizationSrcFolder = 'localization/*.po';
const frontendFolder =  'src/frontend';
const frontEndSources = frontendFolder + '/App';
const frontEndTSFiles = frontEndSources + '/**/*.ts';
const appOutput = 'dist';
const appFiles = appOutput + '/**/*.*';

function launchElectron(cb) {
  electron.start('--remote-debugging-port=9222');
  cb();
}

function restartElectron(cb) {
  electron.restart();
  cb();
}

gulp.task('translations', () => {
  return gulp.src(localizationSrcFolder)
  .pipe(gettext.compile({
      format: 'json'
  }))
  .pipe(gulp.dest(appOutput + '/translations'));
});

gulp.task('angular-app-prod', (cb) => {
  const build = new BuildLauncher(true);

  build.run(cb);
});

gulp.task('angular-app-dev', (cb) => {
  const build = new BuildLauncher();

  build.run(cb);
});

gulp.task('angular-app-dev-watch', (cb) => {
  const build = new BuildLauncher();

  build.watch(cb);
});

gulp.task('tslint',  () => {
  return gulp.src(frontEndTSFiles)
    .pipe(tslint({
      formatter: 'stylish'
    }))
    .pipe(tslint.report({
      emitError: true
    }));
});

function watchCode() {
  gulp.watch(appFiles, restartElectron);
}

function watchTranslations() {
  gulp.watch(localizationSrcFolder, gulp.series('translations') );
}

gulp.task('frontend', gulp.series('tslint', 'angular-app-prod', 'translations'));

gulp.task('frontend-debug', gulp.series('angular-app-dev', 'translations'));

gulp.task('watch-frontend', gulp.series('backend', 'angular-app-dev', 'translations', launchElectron, gulp.parallel('angular-app-dev-watch', watchCode, watchTranslations)));

