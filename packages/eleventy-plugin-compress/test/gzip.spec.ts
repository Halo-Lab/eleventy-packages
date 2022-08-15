import { sep } from 'path';
import { constants, gzip as gzipCompress } from 'zlib';

import { gzip } from '../src/gzip';

const mockDataGZipOptions = {
	content: `
	// src/scripts/site.js
	console.log("running");
	//# sourceMappingURL=site.js.map
	`,
	outputPath: `_site${sep}scripts${sep}site.js`,
};

describe('gzip', () => {
	it('should return object with correct url .gz file and buff data of content', async () => {
		const { url, data } = await gzip(
			mockDataGZipOptions.content,
			mockDataGZipOptions.outputPath,
		);

		const resultBuff = await new Promise<Buffer>((resolve, reject) =>
			gzipCompress(
				mockDataGZipOptions.content,
				{
					level: constants.Z_MAX_LEVEL,
				},
				(error, compressed) => (error ? reject(error) : resolve(compressed)),
			),
		);

		expect(url).toBe(mockDataGZipOptions.outputPath + '.gz');
		expect(data).toStrictEqual(resultBuff);
	});
});
