import { resolve, sep } from 'path';
import mockFs from 'mock-fs';

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
	publicSourcePathToScript: `site.js`,
	esbuildOptions: {},
};

const mockDataNestedTransformFileOptions: TransformFileOptions = {
	inputDirectory: `packages/eleventy-plugin-scripts/mock`,
	buildDirectory: 'build',
	publicDirectory: 'scripts',
	publicSourcePathToScript: `about/about.js`,
	esbuildOptions: {},
};

const mockDataBundleFunctionOptions: {
	html: string;
	outputPath: string;
	options: BundleOptions;
} = {
	html: `<script type="text/javascript" src="https:/cdn.jsdelivr.net/npm/@splidejs/splide@3.6/dist/js/splide.min.js"></script>
<script type="text/javascript" src="site.js"></script>`,
	outputPath: `_site${sep}index.html`,
	options: {
		inputDirectory: mockDataTransformFileOptions.inputDirectory,
		publicDirectory: mockDataTransformFileOptions.publicDirectory,
		esbuildOptions: mockDataTransformFileOptions.esbuildOptions,
	},
};

const mockDataNestedBundleFunctionOptions: {
	html: string;
	outputPath: string;
	options: BundleOptions;
} = {
	html: `<script type="text/javascript" src="https:/cdn.jsdelivr.net/npm/@splidejs/splide@3.6/dist/js/splide.min.js"></script>
<script type="text/javascript" src="about/about.js"></script>`,
	outputPath: `_build${sep}index.html`,
	options: {
		inputDirectory: mockDataNestedTransformFileOptions.inputDirectory,
		publicDirectory: mockDataNestedTransformFileOptions.publicDirectory,
		esbuildOptions: mockDataNestedTransformFileOptions.esbuildOptions,
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
				mockDataTransformFileOptions.publicSourcePathToScript,
		);
	});

	it('should return script file path as nested file', async () => {
		const result = await transformFile(mockDataNestedTransformFileOptions);

		expect(result).toBe(
			'/' +
				mockDataNestedTransformFileOptions.publicDirectory +
				'/' +
				mockDataNestedTransformFileOptions.publicSourcePathToScript,
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

	it('should return correct html with script links (as nested file)', async () => {
		const result = await bundle(
			mockDataNestedBundleFunctionOptions.html,
			mockDataNestedBundleFunctionOptions.outputPath,
			mockDataNestedBundleFunctionOptions.options,
		);

		expect(result)
			.toBe(`<script type="text/javascript" src="https:/cdn.jsdelivr.net/npm/@splidejs/splide@3.6/dist/js/splide.min.js"></script>
<script type="text/javascript" src="/scripts/about/about.js"></script>`);
	});
});
