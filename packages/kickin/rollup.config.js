import json from '@rollup/plugin-json';
import sucrase from '@rollup/plugin-sucrase';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
	input: 'src/index.ts',
	output: {
		dir: 'build',
		format: 'es',
	},
	plugins: [
		json(),
		nodeResolve({
			extensions: ['.js', '.ts'],
			resolveOnly: ['@eleventy-packages/common'],
			moduleDirectories: ['../../node_modules', '../../packages'],
		}),
		sucrase({
			exclude: ['node_modules/**'],
			transforms: ['typescript'],
		}),
		terser(),
	],
	external: [
		'fs',
		'ora',
		'util',
		'path',
		'https',
		'chalk',
		'semver',
		'commander',
		'@fluss/core',
		'child_process',
	],
};
