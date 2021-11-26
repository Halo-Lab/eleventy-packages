import { sep, resolve, extname } from 'path';

import { identity } from '@fluss/core';

import { hash } from './hash';
import { UP_LEVEL_GLOB, URL_DELIMITER } from './constants';
import { isAbsoluteURL, withLeadingSlash } from './url';

export interface FileEntity {
  readonly data: string;
  readonly publicUrl: string;
  readonly sourcePath: string;
  readonly outputPath: string;
  readonly originalUrl: string;
}

export type LinkerOptions<Options> = Options & {
  readonly outputPath: string;
  readonly baseDirectory: string;
  readonly publicDirectory: string;
};

export interface LinkerResult<T> {
  readonly file: FileEntity;
  readonly options: T;
}

export interface Linker<T> {
  (
    sourceUrl: string,
    transformPublicURL?: (path: string) => string,
  ): LinkerResult<T>;
}

export const getEleventyOutputDirectory = (path: string): string =>
  path.replace(process.cwd(), '').split(sep)[0];

export const linker = <Options>({
  outputPath,
  baseDirectory,
  publicDirectory,
  ...options
}: LinkerOptions<Options>): Linker<
  Omit<Options, 'outputPath' | 'baseDirectory' | 'publicDirectory'>
> => {
  const outputDirectory = getEleventyOutputDirectory(outputPath);

  return (sourceUrl, transformPublicURL = identity) => {
    const normalizedSourceUrl = isAbsoluteURL(sourceUrl)
      ? sourceUrl.slice(1)
      : sourceUrl.startsWith(UP_LEVEL_GLOB)
      ? sourceUrl.slice(3)
      : sourceUrl;

    const publicUrl = withLeadingSlash(
      transformPublicURL(
        [publicDirectory, normalizedSourceUrl].join(URL_DELIMITER),
      ),
    );

    const extension = extname(publicUrl.split(URL_DELIMITER).at(-1) ?? '');

    const publicUrlWithHash = publicUrl.replace(
      extension,
      `-${hash()}${extension}`,
    );

    return {
      options,
      file: {
        data: '',
        publicUrl: publicUrlWithHash,
        sourcePath: resolve(baseDirectory, normalizedSourceUrl),
        outputPath: resolve(outputDirectory, publicUrlWithHash.slice(1)),
        originalUrl: sourceUrl,
      },
    };
  };
};
