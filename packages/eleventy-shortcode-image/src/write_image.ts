import fs from 'fs';
import path from 'path';

import { unit } from 'common';
import { pipe, sequentially } from '@fluss/core';

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
    pipe(
      () => path.dirname(outputPath),
      (directory: string) => fs.promises.mkdir(directory, { recursive: true }),
      unit,
    ),
    pipe(
      () => (isData ? source : fs.promises.readFile(source)),
      (data: Buffer | string) => fs.promises.writeFile(outputPath, data),
    ),
  )();
