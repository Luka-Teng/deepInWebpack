const path = require("path")
const webpack = require("webpack")

module.exports = {
    entry: "./tapable-tutorial/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].chunk.js"
    },
    plugins: [
        new webpack.ProgressPlugin()
    ]
}