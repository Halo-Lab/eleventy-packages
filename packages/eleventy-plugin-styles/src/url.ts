import { existsSync } from 'fs';
import { dirname, sep, resolve } from 'path';

import { UP_LEVEL_GLOB, URL_DELIMITER } from 'common';

const isAbsolute = (url: string) => url.startsWith(URL_DELIMITER);

export const pathStats = (url: string) => {
  const directories = dirname(url).split(sep);

  return {
    directories,
    isAbsolute: isAbsolute(url),
    isRelative: !isAbsolute(url),
  };
};

export const resolveFile = (
  url: string,
  inputDirectory: string,
  relativeDirectory: string,
): string => {
  const { isAbsolute } = pathStats(url);

  return isAbsolute
    ? resolve(inputDirectory, url.slice(1))
    : existsSync(resolve(inputDirectory, url))
    ? resolve(inputDirectory, url)
    : resolve(relativeDirectory, url);
};

const removeNameCollision = (url: string, directory: string) =>
  url.startsWith(directory) ? url.replace(directory + URL_DELIMITER, '') : url;

export const buildOutputUrl = (
  url: string,
  publicDirectory: string,
): string => {
  const { isAbsolute } = pathStats(url);

  return (
    isAbsolute
      ? [publicDirectory, url.slice(1)].join(URL_DELIMITER)
      : url.startsWith(UP_LEVEL_GLOB)
      ? [
          publicDirectory,
          removeNameCollision(
            url
              .split(URL_DELIMITER)
              .filter((part) => part !== UP_LEVEL_GLOB)
              .join(URL_DELIMITER),
            publicDirectory,
          ),
        ].join(URL_DELIMITER)
      : [publicDirectory, url].join(URL_DELIMITER)
  ).replace(/(sa|sc)ss$/, 'css');
};
