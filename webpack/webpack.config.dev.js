const merge = require('webpack-merge');
const webpack = require("webpack");
const webpackBaseConfig = require('./webpack.config.base');

module.exports = merge(webpackBaseConfig, {
    output: {
        filename: 'bundle.js' 
    },
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'PRODUCTION': JSON.stringify(false),
            'TEST': JSON.stringify(false)
        })
    ]
});