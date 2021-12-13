import { resolve, join } from 'path';

import * as pwaAssetGenerator from 'pwa-asset-generator';
import { once } from '@fluss/core';
import { ManifestJsonIcon } from 'pwa-asset-generator/dist/models/result';
import {
  done,
  oops,
  start,
  mkdir,
  FsCache,
  readFile,
  writeFile,
  readDirectory,
  DEFAULT_IMAGE,
  withLeadingSlash,
  DEFAULT_ICONS_DIRECTORY,
  DEFAULT_SOURCE_DIRECTORY,
  resolve as resolveWith,
} from '@eleventy-packages/common';

import { TransformOptions } from './types';

const imageResultFileName = 'imageResult.json';

export type Options = Parameters<typeof pwaAssetGenerator.generateImages>[2];
export type LoggerFunction = Parameters<
  typeof pwaAssetGenerator.generateImages
>[3];

export interface GenerateImageOptions {
  /** Path to the favicon file. */
  input: string;
  /** Path to directory of generated images. */
  output: string;
  /** An optional logger to log the result. */
  logger: LoggerFunction;
  /** Options for PWA image generator. */
  options: Options;
  publicDirectory: string;
}

export interface ImageResult {
  html: string;
  manifestJsonContent: ReadonlyArray<ManifestJsonIcon>;
}

/**
 * Generate icon and splash screen images,
 * favicons and mstile images.
 */
const generateImages = async ({
  input,
  output,
  logger,
  options,
  publicDirectory,
}: GenerateImageOptions): Promise<ImageResult> => {
  await mkdir(output);

  const { htmlMeta, manifestJsonContent } =
    await pwaAssetGenerator.generateImages(
      input,
      output,
      {
        log: false,
        mstile: true,
        favicon: true,
        pathOverride: withLeadingSlash(publicDirectory),
        ...options,
      },
      logger,
    );

  return {
    html: Object.values(htmlMeta).join(''),
    manifestJsonContent,
  };
};

const copyFilesFromCache = (cache: FsCache, outputDirectory: string) =>
  cache
    .entries()
    .filter(([key]) => key !== imageResultFileName)
    .forEach(async ([name, { pathToContent }]) => {
      const absolutePathToIcon = resolve(outputDirectory, name);

      await mkdir(absolutePathToIcon);

      readFile(resolve(pathToContent)).to(writeFile(absolutePathToIcon));
    });

export const handleImages = once(
  async ({
    icons = {},
    cache,
    logger,
    options,
    buildDirectory,
  }: Pick<TransformOptions, 'icons'> & { buildDirectory: string } & Pick<
      GenerateImageOptions,
      'logger' | 'options'
    > & {
      cache: FsCache;
    }) => {
    const absolutePathToRawImage = resolve(
      icons.pathToRawImage ?? join(DEFAULT_SOURCE_DIRECTORY, DEFAULT_IMAGE),
    );
    const outputIconsDirectory = resolve(
      buildDirectory,
      icons.publicDirectory ?? DEFAULT_ICONS_DIRECTORY,
    );

    if (cache.has(imageResultFileName)) {
      start('Skip generating icons. Reading from the cache...');

      copyFilesFromCache(cache, outputIconsDirectory);

      return cache
        .get(imageResultFileName)
        .map(({ pathToContent }) =>
          readFile(resolve(pathToContent))
            .encoding('utf8')
            .content()
            .then(JSON.parse as (value: string) => ImageResult)
            .catch(
              () => ({ html: '', manifestJsonContent: [] } as ImageResult),
            ),
        )
        .fill(() =>
          resolveWith({ html: '', manifestJsonContent: [] } as ImageResult),
        )
        .extract();
    }

    start('Starting icons generation');

    const info = await generateImages({
      input: absolutePathToRawImage,
      output: outputIconsDirectory,
      publicDirectory: icons.publicDirectory ?? DEFAULT_ICONS_DIRECTORY,
      options,
      logger,
    }).catch((error) => {
      oops(error);
      return { html: '', manifestJsonContent: [] } as ImageResult;
    });

    cache.put(imageResultFileName, {
      name: imageResultFileName,
      content: JSON.stringify(info),
    });

    readDirectory(outputIconsDirectory)
      .end()
      .then((files) =>
        files.forEach((file) =>
          cache.put(file.name, {
            name: file.name,
            content: readFile(join(outputIconsDirectory, file.name)).start(),
          }),
        ),
      );

    done('Icons for PWA were successfully generated');

    return info;
  },
);
