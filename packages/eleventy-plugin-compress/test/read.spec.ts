import mockFs from 'mock-fs';
import { resolve, sep } from 'path';

import { read } from '../src/read';

const url = `_site${sep}styles${sep}main-9ba107af486.css`;

describe('read', () => {
	beforeAll(() => {
		mockFs({
			node_modules: mockFs.load(resolve('node_modules')),
			[url]: '',
		});
	});

	afterAll(() => {
		mockFs.restore();
	});

	it('should return object with correct url and read file data', async () => {
		const result = await read(url);

		expect(result.url).toBe(url);
		expect(result.data).toBe('');
	});
});
