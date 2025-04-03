const path = require('path');

module.exports = {
	sassOptions: {
		includePaths: [path.join(__dirname, 'public/styles')],
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**.vercel-storage.com',
				port: '',
				pathname: '/**'
			},
			{
				protocol: 'https',
				hostname: '**.googleusercontent.com',
				port: '',
				pathname: '/**'
			},
			{
				protocol: 'https',
				hostname: 'dl.dropboxusercontent.com',
				port: '',
				pathname: '/**'
			}
		]
	},
	webpack: (config) => {
		// Allow for async code in non-modular contexts
		config.experiments = { ...config.experiments, topLevelAwait: true };

		// Allows us to reference CSS classes by camel case from within the JSX files
		config.module.rules
			.find(({oneOf}) => !!oneOf).oneOf
			.filter(({use}) => JSON.stringify(use)?.includes('css-loader'))
			.reduce((acc, {use}) => acc.concat(use), [])
			.forEach(({options}) => {
				if (options.modules) {
					options.modules.exportLocalsConvention = 'camelCase';
				}
			});

		return config;
	}
};