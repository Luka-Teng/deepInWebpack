const path = require("path");
const webpack = require("webpack");

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, "src"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].chunk.js"
    },
    plugins: [
        new webpack.ProgressPlugin(),
    ]
}