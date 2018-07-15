
const webpack = require('webpack');
const path = require('path');


const config = {
	entry: {
		babel: 'babel-polyfill',
		app: './src/app.jsx',
	},
	output: {
		path: path.join(__dirname, '/htdocs/scripts'),
		filename: '[name].js'
	},
	externals : {
        "framework" : "BuddyFramework"
    },
	module: {
		rules : [
			// CSSファイルの読み込み
			{
				// 対象となるファイルの拡張子
				test: /\.(scss|css)$/,
				loaders: [
					'style-loader', 
					{
						loader: 'css-loader',
						// オプションでCSS内のurl()メソッドの取り込みを禁止する
						options: {url: false}
					},
					'sass-loader',
				]
			},
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					presets: ["react", "env"]
				}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					presets: ["env"]
				}
			},
			{
				test: /\.(jpe?g|png|gif|svg|ico)(\?.+)?$/,
				loader: 'url-loader',
			},
			{
				test: /\.txt$/,
				loader: 'raw-loader',
			},
		],
	},
	resolve: {
		extensions: [ '.js', '.jsx']
	},
	devServer: {
		contentBase: path.join(__dirname, 'htdocs'),
		port: 8080,
	},
}

module.exports = config;
