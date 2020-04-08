const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = {
    entry: "./js/main.js",
    output: {
        filename: "./dist/gotty-bundle.js"
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: {
           index: '/foo-app/'
        }
    },
    resolve: {
        extensions: [".js"],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: /node_modules/,
                loader: 'license-loader'
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin()
    ]
};
