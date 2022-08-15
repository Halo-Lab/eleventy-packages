import { sep } from 'path';
import { brotliCompress, constants } from 'zlib';

import { brotli } from '../src/brotli';

const mockDataBrotliOptions = {
	content: `
	// src/scripts/site.js
	console.log("running");
	//# sourceMappingURL=site.js.map
	`,
	outputPath: `_site${sep}scripts${sep}site.js`,
};

describe('brotli', () => {
	it('should return object with correct url .br file and buff data of content', async () => {
		const { url, data } = await brotli(
			mockDataBrotliOptions.content,
			mockDataBrotliOptions.outputPath,
		);

		const resultBuff = await new Promise<Buffer>((resolve, reject) =>
			brotliCompress(
				mockDataBrotliOptions.content,
				{
					params: {
						[constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY,
					},
				},
				(error, compressed) => (error ? reject(error) : resolve(compressed)),
			),
		);

		expect(url).toBe(mockDataBrotliOptions.outputPath + '.br');
		expect(data).toStrictEqual(resultBuff);
	});
});
