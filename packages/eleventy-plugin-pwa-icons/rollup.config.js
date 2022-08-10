import base from '../../rollup.config.base';
import replace from '@rollup/plugin-replace';

export default {
	...base,
	plugins: base.plugins.concat([
		replace({
			preventAssignment: true,
			node_modules: 'modules',
		}),
	]),
	external: ['fs', 'path', 'chalk', 'pwa-asset-generator'],
};
