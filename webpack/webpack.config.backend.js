const webpack = require('webpack');

module.exports =  {
    module: {
        rules: [{
            test: /\.ts$/,
            use: ['ts-loader']    
        }]
    },
    output: {
        filename: 'backend.js',
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    target: 'electron-main',
    mode: 'development',
    devtool: 'inline-source-map',
    stats: {
        warningsFilter: w => w !== 'CriticalDependenciesWarning',
    },
    plugins: [
        new webpack.ProgressPlugin()
    ] 
}