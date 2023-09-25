import { normalize as normalizePath, resolve, sep } from 'path';

import mockFs from 'mock-fs';

import { linker } from '@eleventy-packages/common';

import { PluginState } from '../src/types';
import { getCompiler } from '../src/compile';
import { normalize } from '../src/normalize';
import { bindLinkerWithStyles, findStyles } from '../src/bundle';

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

describe('getCompiler', () => {
	for (const mockDataStylesResult of mockDataStylesResultArr) {
		const { style, extension, linkerOptions } = mockDataStylesResult;

		it(`should compile file, return object with urls path, css data and other properties (${extension})`, async () => {
			mockFs({
				node_modules: mockFs.load(resolve('node_modules')),
				[`src${sep}styles${sep}main.${extension}`]: style,
			});

			const newMockDataHtmlFile = mockDataHtmlFile.replace('scss', extension);
			const linkerResult = bindLinkerWithStyles(linker(linkerOptions))(
				findStyles(newMockDataHtmlFile),
			)[0];

			const { css, urls } = await getCompiler({
				lessOptions: linkerOptions.lessOptions,
				sassOptions: linkerOptions.sassOptions,
			})(linkerResult.file.sourcePath);

			const result = await normalize({
				...linkerOptions,
				css,
				url: linkerResult.file.sourcePath,
				html: newMockDataHtmlFile,
			});

			if (extension === 'scss') {
				expect(urls).toHaveLength(1);
				expect(normalizePath(urls[0])).toBe(
					`${mockDataLinkerOptions.baseDirectory}${sep}main.scss`,
				);
			}

			expect(result.css).toBe('a{color:red}');

			mockFs.restore();
		});
	}
});
