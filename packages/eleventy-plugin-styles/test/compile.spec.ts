import { extname, normalize as normalizePath, resolve, sep } from 'path';

import mockFs from 'mock-fs';

import { linker } from '@eleventy-packages/common';

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
	},
	{
		style: `
		  $variable: red;

			a {
			  color: $variable;
			}`,
		extension: 'scss',
	},
	{
		style: `
$variable: red

a 
  color: $variable`,
		extension: 'sass',
	},
	{
		style: `
			@var: red;

			a {
			  color: @var;
			}
		`,
		extension: 'less',
	},
];

describe('getCompiler', () => {
	for (const mockDataStylesResult of mockDataStylesResultArr) {
		const { style, extension } = mockDataStylesResult;

		it(`should compile file, return object with urls path, css data and other properties (${extension})`, async () => {
			mockFs({
				node_modules: mockFs.load(resolve('node_modules')),
				[`src${sep}styles${sep}main.${extension}`]: style,
			});

			const newMockDataHtmlFile = mockDataHtmlFile.replace('scss', extension);
			const linkerResult = bindLinkerWithStyles(linker(mockDataLinkerOptions))(
				findStyles(newMockDataHtmlFile),
			)[0];

			const { css, urls } = await getCompiler({
				extension: extname(linkerResult.file.sourcePath).substring(1),
				lessOptions: mockDataLinkerOptions.lessOptions,
				sassOptions: mockDataLinkerOptions.sassOptions,
			})(linkerResult.file.sourcePath);

			const result = await normalize({
				...mockDataLinkerOptions,
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
