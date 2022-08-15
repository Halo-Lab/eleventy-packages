import mockFs from 'mock-fs';
import { normalize, resolve } from 'path';

import { compressHTMLWithLinks } from '../src/compress_html_with_links';

import { CompressAlgorithm } from '../src/types';

const mockDataCompressHTMLWithLinksOptions = {
	content: '',
	outputPath: '_site/pages/about/index.html',
	algorithm: 'brotli' as CompressAlgorithm | ReadonlyArray<CompressAlgorithm>,
	buildDirectory: '_site',
};

describe('compressHTMLWithLinks', () => {
	beforeAll(() => {
		mockFs({
			node_modules: mockFs.load(resolve('node_modules')),
			[resolve(
				normalize(mockDataCompressHTMLWithLinksOptions.outputPath + '.br'),
			)]: '',
		});
	});

	afterAll(() => {
		mockFs.restore();
	});

	it('should return ...', async () => {
		await compressHTMLWithLinks(
			mockDataCompressHTMLWithLinksOptions.content,
			mockDataCompressHTMLWithLinksOptions.outputPath,
			mockDataCompressHTMLWithLinksOptions.algorithm,
			mockDataCompressHTMLWithLinksOptions.buildDirectory,
		);
	});
});
