const path = require("path");
const webpack = require("webpack");
const MyPlugin = require('./myPlugin')

module.exports = {
	mode: 'development',
	devtool: 'cheap-source-map',
	entry: path.resolve(__dirname, "src"),
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].chunk.js"
	},
	plugins: [
		new webpack.ProgressPlugin(),
		new MyPlugin()
	],
	resolve: {
		extensions: ['.mjs', '.web.js', '.js', '.json', '.web.jsx', '.jsx'],
		alias: {
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
      '@': path.resolve(__dirname, './src')
    }
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				enforce: 'pre',
				use: [
					{
						options: {
						},
						loader: path.resolve(__dirname, 'loader')
					}
				]
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]',
						},
					},
				],
			},
		]
	}
}