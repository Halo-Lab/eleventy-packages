import base from '../../rollup.config.base';

export default {
	...base,
	external: ['chalk', 'workbox-build'],
};
