import { extname, normalize as normalizePath, resolve, sep } from 'path';

import mockFs from 'mock-fs';

import { linker } from '@eleventy-packages/common';

import { normalize } from '../src/normalize';
import { getCompiler } from '../src/compile';
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
		  }
		  
		  div {
		    color: red;
		  }`,
		extension: 'css',
		linkerOptions: {
			...mockDataLinkerOptions,
			purgeCSSOptions: {},
		},
	},
	{
		style: `
		  $variable: red;

			div {
			  color: $variable;
			}`,
		extension: 'scss',
		linkerOptions: {
			...mockDataLinkerOptions,
		},
	},
	{
		style: `
$variable: red

div 
  color: $variable`,
		extension: 'sass',
		linkerOptions: {
			...mockDataLinkerOptions,
		},
	},
	{
		style: `
			@var: red;
			
			__test {
			  color: @var;
			}

			div {
			  color: @var;
			}`,
		extension: 'less',
		linkerOptions: {
			...mockDataLinkerOptions,
			purgeCSSOptions: {
				safelist: {
					deep: [/^__/],
				},
			},
		},
	},
];

describe('normalize', () => {
	for (const mockDataStylesResult of mockDataStylesResultArr) {
		const { style, extension, linkerOptions } = mockDataStylesResult;

		it(`should compile and normalize ${extension} style successfully`, async () => {
			mockFs({
				node_modules: mockFs.load(resolve('node_modules')),
				[`src${sep}styles${sep}main.${extension}`]: style,
			});

			const newMockDataHtmlFile = mockDataHtmlFile.replace('scss', extension);

			const linkerResult = bindLinkerWithStyles(linker(linkerOptions))(
				findStyles(newMockDataHtmlFile),
			)[0];

			const { options, file } = linkerResult;

			const compile = getCompiler({
				extension: extname(linkerResult.file.sourcePath).substring(1),
				sassOptions: options.sassOptions,
				lessOptions: options.lessOptions,
			});

			const { css, urls } = await compile(file.sourcePath);

			const result = await normalize({
				...options,
				css,
				url: file.sourcePath,
				html: mockDataHtmlFile,
			});

			switch (extension) {
				case 'css': {
					expect(result.css).toBe('a{color:red}');

					break;
				}
				case 'scss': {
					expect(urls).toHaveLength(1);
					expect(normalizePath(urls[0])).toBe(
						`${mockDataLinkerOptions.baseDirectory}${sep}main.scss`,
					);
					expect(result.css).toBe('div{color:red}');

					break;
				}
				case 'sass': {
					expect(result.css).toBe('div{color:red}');

					break;
				}
				case 'less': {
					expect(result.css).toBe('__test{color:red}');

					break;
				}
			}

			mockFs.restore();
		});
	}
});
