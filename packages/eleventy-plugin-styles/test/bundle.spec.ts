import { normalize, resolve, sep } from 'path';

import mockFs from 'mock-fs';

import { linker } from '@eleventy-packages/common';

import {
	findStyles,
	writeStyleFile,
	createFileBundler,
	bindLinkerWithStyles,
	createPublicUrlInjector,
} from '../src/bundle';
import { PluginState } from '../src/types';

const mockDataLinkerOptions = {
	outputPath: `_site${sep}index.html`,
	baseDirectory: `src${sep}styles`,
	publicDirectory: 'styles',
	lessOptions: {},
	sassOptions: {},
};

const mockDataHtmlFile = `
				<link rel="stylesheet" href="main.scss"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"/>
        <body>
          <a>Hello</a>
				</body>
`;

const mockDataStylesResultArr = [
	{
		style: `
		  a {
		    color: red;
		  }`,
		extension: 'css',
		linkerOptions: {
			...mockDataLinkerOptions,
			sassOptions: PluginState.Off,
			lessOptions: PluginState.Off,
		},
	},
	{
		style: `
		  $variable: red;

			a {
			  color: $variable;
			}`,
		extension: 'scss',
		linkerOptions: {
			...mockDataLinkerOptions,
			lessOptions: PluginState.Off,
		},
	},
	{
		style: `
			@var: red;

			a {
			  color: @var;
			}
		`,
		extension: 'less',
		linkerOptions: {
			...mockDataLinkerOptions,
			sassOptions: PluginState.Off,
		},
	},
];

const getQuery = (url: string): string => url.match(/\?([^"]*)/)?.[1] || '';

describe('findStyles', () => {
	it('should return array of links', () => {
		const result = findStyles(mockDataHtmlFile);

		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(1);
		expect(result[0]).toBe('main.scss');
	});
});

describe('bindLinkerWithStyles', () => {
	it('should return array of links with new options (path, type)', () => {
		const result = bindLinkerWithStyles(linker(mockDataLinkerOptions))(
			findStyles(mockDataHtmlFile),
		);

		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(1);
		expect(result[0].file.publicUrl).toContain('.css');
		expect(result[0].file.outputPath).toContain('.css');
	});
});

describe('createPublicUrlInjector', () => {
	it('should return correct html links as string', () => {
		const mockDataUrlInjector = bindLinkerWithStyles(
			linker(mockDataLinkerOptions),
		)(findStyles(mockDataHtmlFile))[0].file;

		const result =
			createPublicUrlInjector(mockDataUrlInjector)(mockDataHtmlFile);
		const query = getQuery(result);

		expect(typeof result).toBe('string');
		expect(query).toHaveLength(11);
		expect(result).toContain(
			`<link rel="stylesheet" href="${mockDataUrlInjector.publicUrl}?${query}"/>`,
		);
		expect(result).toContain(
			`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"/>`,
		);
	});
});

describe('createFileBundler', () => {
	// Test with 3 extensions css, scss, less
	for (const mockDataStylesResult of mockDataStylesResultArr) {
		const { style, extension, linkerOptions } = mockDataStylesResult;

		it(`should compile file, return object with urls path, css data and other properties (${extension})`, async () => {
			mockFs({
				node_modules: mockFs.load(resolve('node_modules')),
				[`${linkerOptions.baseDirectory}${sep}main.${extension}`]: style,
			});

			const newMockDataHtmlFile = mockDataHtmlFile.replace('scss', extension);
			const linkerResult = bindLinkerWithStyles(linker(linkerOptions))(
				findStyles(newMockDataHtmlFile),
			)[0];

			const result = await createFileBundler(linkerResult)(newMockDataHtmlFile);

			if (extension === 'scss') {
				expect(result.urls).toHaveLength(1);
				expect(normalize(result.urls[0])).toBe(
					`${linkerOptions.baseDirectory}${sep}main.${extension}`,
				);
			}
			expect(result.data).toBe('a{color:red}');

			mockFs.restore();
		});
	}
});

describe('writeStyleFile', () => {
	beforeAll(() => {
		mockFs({
			node_modules: mockFs.load(resolve('node_modules')),
			[`${mockDataLinkerOptions.baseDirectory}${sep}main.scss`]: '',
		});
	});

	afterAll(() => {
		mockFs.restore();
	});

	it('should success create folder and write file', async () => {
		const linkerResult = bindLinkerWithStyles(linker(mockDataLinkerOptions))(
			findStyles(mockDataHtmlFile),
		)[0];

		const result = await createFileBundler(linkerResult)(mockDataHtmlFile);

		await writeStyleFile(result);
	});
});
