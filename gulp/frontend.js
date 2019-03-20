const path = require('path');
const fs = require("fs");
const gulp = require('gulp');
const gettext = require('gulp-angular-gettext');
const webpack = require('webpack-stream');
const tslint = require('gulp-tslint');
const runSequence = require('run-sequence');

const webpackConfigDev = require('../webpack/webpack.config.dev');
const webpackConfigProd = require('../webpack/webpack.config.prod');

const localizationSrcFolder = path.resolve(__dirname, '../localization/*.po')
const frontendFolder =  path.resolve(__dirname, '../src/frontend');
const frontEndSources = path.resolve(frontendFolder, 'App');
const boot = path.resolve(frontEndSources, 'Boot.ts');
const frontEndTSFiles = path.resolve(frontEndSources, '**/*.ts');
const appOutput = path.resolve(__dirname, '../dist');
const frontEndBundle = path.resolve(appOutput, 'bundle.js');

gulp.task('translations', () => {
  return gulp.src(localizationSrcFolder)
  .pipe(gettext.compile({
      format: 'json'
  }))
  .pipe(gulp.dest(path.resolve(appOutput, 'translations')));
});

gulp.task('index', () => {
  return gulp.src(path.resolve(frontendFolder, 'index.htm')).pipe(gulp.dest(appOutput));
});

gulp.task('icon', () => {
  return gulp.src(path.resolve(frontendFolder, 'favicon.ico')).pipe(gulp.dest(appOutput));
});

gulp.task('empty-bundle', (done) => {
  fs.writeFile(frontEndBundle, "(empty)", done);
});

gulp.task('angular-app-prod', () => {
  return gulp.src(boot)
    .pipe(webpack(webpackConfigProd))
    .pipe(gulp.dest(appOutput));
});

gulp.task('angular-app-dev', () => {
  return gulp.src(boot)
    .pipe(webpack(webpackConfigDev))
    .pipe(gulp.dest(appOutput));
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
  let buildAppTask = 'angular-app-prod';
  if (process.argv.length > 3 && process.argv[3] === "--dev") {
    buildAppTask = 'angular-app-dev';
  }
  runSequence('tslint', ['index', 'icon', 'translations', 'electron-launch-files'], buildAppTask, () => done());
});

gulp.task('watch-frontend', (done) => {
    webpackConfigDev.watch = true;
    webpackConfigDev.watchOptions = {
      ignored: [ 'node_modules' ],
      aggregateTimeout: 500
    };
    runSequence(['index', 'icon', 'translations', 'electron-launch-files'], 'empty-bundle', ['angular-app-dev', 'electron-watch'], done);
 });
