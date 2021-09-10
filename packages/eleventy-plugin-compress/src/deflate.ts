import { deflate as deflateCompress, constants } from 'zlib';

import { CompressedContentInfo } from './types';

/** Compress content with `deflate` algorithm. */
export const deflate = (
  content: string,
  outputPath: string
): Promise<CompressedContentInfo> =>
  new Promise<Buffer>((resolve, reject) =>
    deflateCompress(
      content,
      {
        level: constants.Z_MAX_LEVEL,
      },
      (error, compressed) => (error ? reject(error) : resolve(compressed))
    )
  ).then((data) => ({ data, url: outputPath + '.deflate' }));
