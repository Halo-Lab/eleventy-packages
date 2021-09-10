import fs from 'fs';
import https from 'https';

import { sequentially, when } from '@fluss/core';

import { Source, SourceUrl } from './path_converter';

/** Downloads image and returns absolute path to it. */
const download = async (url: string, to: string): Promise<void> =>
  new Promise((resolve, reject) =>
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(to);

      res.pipe(fileStream);

      fileStream.on('error', reject).on('finish', () => {
        fileStream.close();
        resolve();
      });
    }),
  );

/** Downloads image if it's not exist. */
export const fetchImage = when(
  (source: Source): source is SourceUrl =>
    source.isURL && !fs.existsSync(source.sourcePath),
)(
  // Because we have checked in predicate that source is URL,
  // so we can safely type source parameter as SourceUrl.
  sequentially(
    (source: Source) =>
      fs.promises.mkdir(source.sourceDir, { recursive: true }),
    (source: SourceUrl) => download(source.sourceUrl, source.sourcePath),
  ),
  () => Promise.resolve<ReadonlyArray<string | void>>([]),
);
