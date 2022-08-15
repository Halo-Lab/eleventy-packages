import { normalize, resolve, sep } from 'path';
import mockFs from 'mock-fs';

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

describe('getCompiler', () => {
	beforeAll(() => {
		mockFs({
			node_modules: mockFs.load(resolve('node_modules')),
			[`src${sep}styles${sep}main.scss`]: '',
		});
	});

	afterAll(() => {
		mockFs.restore();
	});

	it('should compile file, return object with urls path, css data and other properties', async () => {
		const linkerResult = bindLinkerWithStyles(linker(mockDataLinkerOptions))(
			findStyles(mockDataHtmlFile),
		)[0];

		const result = await getCompiler({ lessOptions: {}, sassOptions: {} })(
			linkerResult.file.sourcePath,
		);

		expect(result.urls).toHaveLength(1);
		expect(normalize(result.urls[0])).toBe(
			`${mockDataLinkerOptions.baseDirectory}${sep}main.scss`,
		);
		expect(result.css).toBe('');
	});
});
