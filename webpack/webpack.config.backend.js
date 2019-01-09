const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config.base');

module.exports = merge(webpackBaseConfig, {
    output: {
        filename: 'main.js' 
    },
    target: 'electron-main',
    mode: 'development',
    devtool: 'inline-source-map',
    externals: ['express', 'electron']
});