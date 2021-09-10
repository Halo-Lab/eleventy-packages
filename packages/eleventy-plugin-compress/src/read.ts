import { resolve } from 'path';
import { promises } from 'fs';

import { oops } from 'common';

import { RawContentInfo } from './types';

/** Read file from _build_ directory. */
export const read = async (url: string): Promise<RawContentInfo> => ({
  data: await promises
    .readFile(resolve(url), {
      encoding: 'utf-8',
    })
    .catch((error) => (oops(error), '')),
  url,
});
