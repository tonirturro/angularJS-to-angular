const { task, src, dest } = require('gulp');
const path = require('path');
const webpack = require('webpack-stream');
const webpackConfigBackend = require('../webpack/webpack.config.backend');

const backendOutput = path.resolve(__dirname, '../backend-build');
const backendSources = path.resolve(__dirname, '../src/backend');
const backendMain = path.resolve(backendSources, 'main.ts');

task('backend', (cb) => {
  return src(backendMain)
  .pipe(webpack(webpackConfigBackend))
  .pipe(dest(backendOutput));
});
