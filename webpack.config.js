const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = {
    entry: "./src/main.js",
    devtool: 'inline-source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "gotty-bundle.js",
        publicPath: 'http://localhost:3000'
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
        historyApiFallback: {
            index: './dist/index.html'
        }
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".css"],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: /node_modules/,
                loader: 'license-loader'
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin()
    ]
};