const merge = require('webpack-merge');
const webpack = require("webpack");
const webpackBaseConfig = require('./webpack.config.base');

module.exports = merge(webpackBaseConfig, {
    target: "electron-renderer",
    output: {
        filename: 'bundle.js' 
    },
    mode: 'production',
    target: "electron-renderer",
    plugins: [
        new webpack.DefinePlugin({
            'PRODUCTION': JSON.stringify(true),
            'TEST': JSON.stringify(false)
        })
    ]
});