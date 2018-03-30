var webpack = require('webpack');
const path = require('path');

module.exports = {
    context: path.resolve('src'),
    entry: './main.jsx',
    mode: 'development',
    output: {
        path: path.resolve('dist'),
        filename: 'main.js'
    },
    devtool: "source-map",
    resolve: {
        extensions: [".jsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ['react', 'stage-0'],
                        plugins: ["transform-decorators-legacy"]
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'static'),
    }
}