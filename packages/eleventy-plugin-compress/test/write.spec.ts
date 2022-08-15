import mockFs from 'mock-fs';
import { resolve, sep } from 'path';

import { write } from '../src/write';

const mockDataWriteOptions = {
	data: Buffer.from(''),
	url: ` _site${sep}scripts${sep}site.js.gz`,
};

describe('write', () => {
	beforeAll(() => {
		mockFs({
			node_modules: mockFs.load(resolve('node_modules')),
			[mockDataWriteOptions.url]: '',
		});
	});

	afterAll(() => {
		mockFs.restore();
	});

	it('should correct write file', async () => {
		await write(mockDataWriteOptions);
	});
});
