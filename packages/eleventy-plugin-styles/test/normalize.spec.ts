import mockFs from 'mock-fs';
import { resolve, sep } from 'path';

import { normalize } from '../src/normalize';
import { getCompiler } from '../src/compile';
import { bindLinkerWithStyles, findStyles } from '../src/bundle';
import { linker } from '../../common/src/linker';

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
`;

describe('normalize', () => {
	beforeAll(() => {
		mockFs({
			node_modules: mockFs.load(resolve('node_modules')),
			[`${mockDataLinkerOptions.baseDirectory}${sep}main.scss`]: '',
			'package.json': mockFs.load(resolve('package.json')),
		});
	});

	afterAll(() => {
		mockFs.restore();
	});

	it('should return ...', async () => {
		const linkerResult = bindLinkerWithStyles(linker(mockDataLinkerOptions))(
			findStyles(mockDataHtmlFile),
		)[0];

		const { options, file } = linkerResult;

		const compile = getCompiler({
			sassOptions: options.sassOptions,
			lessOptions: options.lessOptions,
		});

		const { css } = await compile(file.sourcePath);

		const result = await normalize({
			...options,
			css,
			url: file.sourcePath,
			html: mockDataHtmlFile,
		});

		expect(result.css).toBe('');
	});
});
