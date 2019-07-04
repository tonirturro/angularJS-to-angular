
module.exports =  {
    output: {
        filename: 'backend.js' 
    },
    target: 'electron-main',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
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
        extensions: ['.js', '.ts']
    },
    devtool: 'inline-source-map'
}