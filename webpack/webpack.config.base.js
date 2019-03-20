const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const helpers = require('./helpers');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(htm|html)$/,
                use: ["html-loader"]
            },
            {
                test: /\.scss$/,
                exclude: /\.component.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                exclude: /\.component.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.component.css$/,
                use: ['raw-loader']
            },
            {
                test: /\.component.scss$/,
                use: [
                    'raw-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg)$/,
                use: 'file-loader'
            },
            {
                test: /\.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        experimentalWatchApi: true
                    }
                }, 'angular2-template-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    plugins: [
        new WebpackBar(),
        new webpack.ContextReplacementPlugin(
            /\@angular(\\|\/)core(\\|\/)fesm5/,
            helpers.root('./src'),
            {}
        ),
        new FilterWarningsPlugin({
            exclude: /System.import/
        })
    ],
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
    }
}