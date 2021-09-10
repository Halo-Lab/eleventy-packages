import { promises } from 'fs';

import { CompressedContentInfo } from './types';

/** Writes file. */
export const write = ({ data, url }: CompressedContentInfo) =>
  promises.writeFile(url, data, { encoding: 'utf-8' });
