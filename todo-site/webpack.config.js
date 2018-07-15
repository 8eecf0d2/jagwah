const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

module.exports = {
	entry: './src/ts/index.ts',
	devtool: 'source-map',
	mode: process.env.MODE,
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
		port: 3000,
		content: ['./src/html', './src'],
		add: (app, middleware, options) => {
			app.use(convert(history({})));
		}
	}
}
