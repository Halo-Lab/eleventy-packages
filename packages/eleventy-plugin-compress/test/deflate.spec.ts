import { sep } from 'path';
import { constants, deflate as deflateCompress } from 'zlib';

import { deflate } from '../src/deflate';

const mockDataDeflateOptions = {
	content: `
	// src/scripts/site.js
	console.log("running");
	//# sourceMappingURL=site.js.map
	`,
	outputPath: `_site${sep}scripts${sep}site.js`,
};

describe('deflate', () => {
	it('should return object with correct url .deflate file and buff data of content', async () => {
		const { url, data } = await deflate(
			mockDataDeflateOptions.content,
			mockDataDeflateOptions.outputPath,
		);

		const resultBuff = await new Promise<Buffer>((resolve, reject) =>
			deflateCompress(
				mockDataDeflateOptions.content,
				{
					level: constants.Z_MAX_LEVEL,
				},
				(error, compressed) => (error ? reject(error) : resolve(compressed)),
			),
		);

		expect(url).toBe(mockDataDeflateOptions.outputPath + '.deflate');
		expect(data).toStrictEqual(resultBuff);
	});
});
