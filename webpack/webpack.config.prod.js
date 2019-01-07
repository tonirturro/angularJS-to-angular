const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config.base');

module.exports = merge(webpackBaseConfig, {
    target: "electron-renderer",
    output: {
        filename: 'bundle.js' 
    },
    mode: 'production',
    target: "electron-renderer"
});