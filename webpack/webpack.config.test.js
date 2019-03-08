const path = require('path');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const helpers = require('./helpers');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = {
    target: "web",
    devtool: "inline-source-map",
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(htm|html)$/,
                use: ["html-loader"]
            },
            {
                test: /\.(css|scss)$/,
                exclude: /\.component.(css|scss)$/,
                use: 'null-loader'
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
                test: /\.component.ng2.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        experimentalWatchApi: true
                    }
                }, 'angular2-template-loader']
            },
            {
                test: /\.ts$/,
                exclude:  /\.component.ng2.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        experimentalWatchApi: true
                    }
                }]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts'],
        alias: {
            'angular': path.resolve(path.join(__dirname, '..', 'node_modules', 'angular'))
        }
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
        }),
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery'
        })    
    ],
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
    }
}
