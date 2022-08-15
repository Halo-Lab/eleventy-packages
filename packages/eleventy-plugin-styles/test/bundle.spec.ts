import mockFs from 'mock-fs';
import { normalize, resolve, sep } from 'path';

import {
	bindLinkerWithStyles,
	createFileBundler,
	createPublicUrlInjector,
	findStyles,
	writeStyleFile,
} from '../src/bundle';
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

		expect(typeof result).toBe('string');
		expect(result).toContain(
			`<link rel="stylesheet" href="${mockDataUrlInjector.publicUrl}"/>`,
		);
		expect(result).toContain(
			`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"/>`,
		);
	});
});

describe('createFileBundler', () => {
	beforeAll(() => {
		mockFs({
			node_modules: mockFs.load(resolve('node_modules')),
			[`${mockDataLinkerOptions.baseDirectory}${sep}main.scss`]: '',
		});
	});

	afterAll(() => {
		mockFs.restore();
	});

	it('should compile file, return object with urls path, css data and other properties', async () => {
		const linkerResult = bindLinkerWithStyles(linker(mockDataLinkerOptions))(
			findStyles(mockDataHtmlFile),
		)[0];

		const result = await createFileBundler(linkerResult)(mockDataHtmlFile);

		expect(result.urls).toHaveLength(1);
		expect(normalize(decodeURI(result.urls[0]))).toBe(
			`${mockDataLinkerOptions.baseDirectory}${sep}main.scss`,
		);
		expect(result.data).toBe('');
	});
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
