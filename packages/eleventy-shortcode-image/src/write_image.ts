import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

import { pipe, sequentially } from '@fluss/core';
import { makeDirectories, unit } from '@eleventy-packages/common';

/**
 * Writes image from _sourcePath_ to _outputPath_.
 * If image is located in-memory, then _sourcePath_
 * should be image data and _isData_ need to be `true`.
 */
export const writeImage = (
  source: string,
  outputPath: string,
  isData = false,
) =>
  sequentially(
    pipe(() => path.dirname(outputPath), makeDirectories),
    () =>
      (isData ? Readable.from(source) : fs.createReadStream(source)).pipe(
        fs.createWriteStream(outputPath),
      ),
  )().then(unit);
