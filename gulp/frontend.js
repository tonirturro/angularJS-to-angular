const path = require('path');
const fs = require("fs");
const gulp = require('gulp');
const templateCache = require('gulp-angular-templatecache');
const webpack = require('webpack-stream');
const tslint = require('gulp-tslint');
const runSequence = require('run-sequence');

const webpackConfigDev = require('../webpack/webpack.config.dev');
const webpackConfigProd = require('../webpack/webpack.config.prod');

const frontendFolder =  path.resolve(__dirname, '../src/frontend');
const frontEndSources = path.resolve(frontendFolder, 'App');
const templates = path.resolve(frontEndSources, 'Components/**/*.htm');
const boot = path.resolve(frontEndSources, 'Boot.ts');
const frontEndTSFiles = path.resolve(frontEndSources, '**/*.ts');
const appOutput = path.resolve(__dirname, '../dist');
const frontEndBundle = path.resolve(appOutput, 'bundle.js');

gulp.task('views', function() {
  return gulp.src(templates)
    .pipe(templateCache({
      standalone: true
    }))
    .pipe(gulp.dest(frontEndSources));
});

gulp.task('index', function() {
  return gulp.src(path.resolve(frontendFolder, 'index.htm')).pipe(gulp.dest(appOutput));
});

gulp.task('icon', function() {
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
  runSequence('tslint', ['index', 'icon', 'views', 'electron-launch-files'], buildAppTask, () => done());
});

gulp.task('watch-templates', () => {
  gulp.watch(templates, ['views']);
});

gulp.task('watch-frontend', (done) => {
    webpackConfigDev.watch = true;
    webpackConfigDev.watchOptions = {
      ignored: [ 'node_modules' ],
      aggregateTimeout: 500
    };
    runSequence(['index', 'icon', 'views', 'electron-launch-files'], 'empty-bundle', ['angular-app-dev', 'electron-watch', 'watch-templates'], done);
 });
