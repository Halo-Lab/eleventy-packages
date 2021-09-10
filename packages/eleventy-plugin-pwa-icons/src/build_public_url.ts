import { URL_DELIMITER } from 'common';

export const buildPublicUrl = (
  ...parts: ReadonlyArray<string | undefined>
): string =>
  parts
    .filter((part) => typeof part === 'string')
    .filter(Boolean)
    .join(URL_DELIMITER);
