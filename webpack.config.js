const mode = process.env.NODE_ENV.trim();

module.exports = {
	mode: mode,
	output: {
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				query: {
					presets: [
						"@babel/preset-env"
					],
				},
			},
		],
	},
};
