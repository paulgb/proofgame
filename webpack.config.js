var webpack = require('webpack');
const path = require('path');

module.exports = {
    context: path.resolve('src'),
    entry: './main.tsx',
    mode: 'development',
    output: {
        path: path.resolve('dist'),
        filename: 'main.js'
    },
    devtool: "source-map",
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.[tj]sx?$/,
                use: {
                    loader: 'ts-loader',
                },
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'static'),
    }
}
