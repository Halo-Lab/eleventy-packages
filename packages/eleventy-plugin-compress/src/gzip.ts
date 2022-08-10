import { gzip as gzipCompress, constants } from 'zlib';

import { CompressedContentInfo } from './types';

/** Compress content with `gzip` algorithm. */
export const gzip = (
	content: string,
	outputPath: string,
): Promise<CompressedContentInfo> =>
	new Promise<Buffer>((resolve, reject) =>
		gzipCompress(
			content,
			{
				level: constants.Z_MAX_LEVEL,
			},
			(error, compressed) => (error ? reject(error) : resolve(compressed)),
		),
	).then((data) => ({ data, url: outputPath + '.gz' }));
