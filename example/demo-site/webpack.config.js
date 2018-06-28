const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

module.exports = {
	entry: './src/ts/index.ts',
	devtool: 'source-map',
	mode: process.env.MODE,
	plugins: [
		new webpack.DefinePlugin({
			ENV: JSON.stringify(process.env.NODE_ENV),
			APIURL: JSON.stringify(process.env.NODE_ENV === 'development' ? 'http://dev.api.hyper.ng' : 'https://api.hyper.ng'),
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			openAnalyzer: false,
			reportFilename: './dist/webpack-report.html',
		}),
	],
	optimization: {
		minimizer: [
			new UglifyJSPlugin({
				sourceMap: true,
				uglifyOptions: {
					output: { ascii_only: true }
				}
			})
		]
	},
	module: {
		rules: [{
			test: /\.ts?$/,
			use: 'ts-loader',
			exclude: /node_modules/
		},{
			test: /\.md$/,
			use: [{
				loader: "html-loader"
			},{
				loader: "highlight-loader"
			},{
				loader: "markdown-loader",
				options: { langPrefix: '' }
			}]
		}]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},
	output: {
		filename: './dist/bundle.js',
		path: path.resolve(__dirname)
	}
};

if(process.env.WEBPACK_SERVE) {
	module.exports.serve = {
		port: 9090,
		content: ['./src/html', './src'],
		add: (app, middleware, options) => {
			app.use(convert(history({})));
		}
	}
}
