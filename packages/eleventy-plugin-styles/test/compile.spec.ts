import mockFs from 'mock-fs';
import { normalize, resolve, sep } from 'path';

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

	it('should return ...', async () => {
		const linkerResult = bindLinkerWithStyles(linker(mockDataLinkerOptions))(
			findStyles(mockDataHtmlFile),
		)[0];

		const result = await getCompiler({ lessOptions: {}, sassOptions: {} })(
			linkerResult.file.sourcePath,
		);

		// Delete first "/" because wrong path started with "/" (/C:/Folder/)
		const resultUrls = result.urls.map((url) => url.slice(1));

		expect(resultUrls).toHaveLength(1);
		expect(normalize(decodeURI(resultUrls[0]))).toBe(
			resolve(`${mockDataLinkerOptions.baseDirectory}${sep}main.scss`),
		);
		expect(result.css).toBe('');
	});
});
