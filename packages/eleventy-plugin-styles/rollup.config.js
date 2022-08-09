import base from '../../rollup.config.base';

export default {
	...base,
	external: [
		'fs',
		'path',
		'sass',
		'chalk',
		'cssnano',
		'postcss',
		'critical',
		'autoprefixer',
		'@fullhuman/postcss-purgecss',
	],
};
