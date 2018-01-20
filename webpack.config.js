var webpack = require('webpack');
    
const path = require('path');

module.exports = {
    entry: './src/app.ts',
    
    devtool: 'source-map',
    devServer: {
        hot: true
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
    
        new webpack.NamedModulesPlugin(),

        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }

    
};
