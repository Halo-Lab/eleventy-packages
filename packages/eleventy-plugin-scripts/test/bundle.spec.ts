import mockFs from 'mock-fs';
import { basename, resolve, sep } from 'path';

import {
	bundle,
	BundleOptions,
	transformFile,
	TransformFileOptions,
} from '../src/bundle';

const mockDataTransformFileOptions: TransformFileOptions = {
	inputDirectory: `packages/eleventy-plugin-scripts/mock`,
	buildDirectory: '_site',
	publicDirectory: 'scripts',
	publicSourcePathToScript: `/site.js`,
	esbuildOptions: {},
};

const mockDataBundleFunctionOptions: {
	html: string;
	outputPath: string;
	options: BundleOptions;
} = {
	html: `<script type="text/javascript" src="https:/cdn.jsdelivr.net/npm/@splidejs/splide@3.6/dist/js/splide.min.js"></script>
<script type="text/javascript" src="/site.js"></script>`,
	outputPath: `_site${sep}index.html`,
	options: {
		inputDirectory: mockDataTransformFileOptions.inputDirectory,
		publicDirectory: mockDataTransformFileOptions.publicDirectory,
		esbuildOptions: mockDataTransformFileOptions.esbuildOptions,
	},
};

describe('transformFile', () => {
	beforeAll(() => {
		mockFs({
			node_modules: mockFs.load(resolve('node_modules')),
		});
	});

	afterAll(() => {
		mockFs.restore();
	});

	it('should return script file path', async () => {
		const result = await transformFile(mockDataTransformFileOptions);

		expect(result).toBe(
			'/' +
				mockDataTransformFileOptions.publicDirectory +
				'/' +
				basename(mockDataTransformFileOptions.publicSourcePathToScript),
		);
	});
});

describe('bundle', () => {
	it('should return correct html with script links', async () => {
		const result = await bundle(
			mockDataBundleFunctionOptions.html,
			mockDataBundleFunctionOptions.outputPath,
			mockDataBundleFunctionOptions.options,
		);

		expect(result)
			.toBe(`<script type="text/javascript" src="https:/cdn.jsdelivr.net/npm/@splidejs/splide@3.6/dist/js/splide.min.js"></script>
<script type="text/javascript" src="/scripts/site.js"></script>`);
	});
});
