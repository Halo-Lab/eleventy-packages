import { brotliCompress, constants } from 'zlib';

import { CompressedContentInfo } from './types';

/** Compress content with `brotli` algorithm. */
export const brotli = (
  content: string,
  outputPath: string
): Promise<CompressedContentInfo> =>
  new Promise<Buffer>((resolve, reject) =>
    brotliCompress(
      content,
      {
        params: {
          [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY,
        },
      },
      (error, compressed) => (error ? reject(error) : resolve(compressed))
    )
  ).then((data) => ({ data, url: outputPath + '.br' }));
