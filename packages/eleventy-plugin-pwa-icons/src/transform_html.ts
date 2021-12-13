import { done, FsCache } from '@eleventy-packages/common';

import { handleManifest } from './update_manifest';
import { TransformOptions } from './types';
import { buildManifestLinkTag } from './build_manifest_link';
import { Options, handleImages, LoggerFunction } from './generate_images';

export type PWAIconsOptions = TransformOptions & {
  logger?: LoggerFunction;
  /** Decide whether plugin should do its work. */
  enabled?: boolean;
  generatorOptions?: Options;
};

/**
 * Transform function that inserts links of PWA images
 * into HTML file and updates manifest file.
 */
export const generateAndInsertIcons = async (
  html: string,
  buildDirectory: string,
  {
    icons,
    cache,
    logger,
    manifest,
    generatorOptions: options,
  }: PWAIconsOptions & {
    cache: FsCache;
  },
): Promise<string> => {
  const { html: imagesHTML, manifestJsonContent } = await handleImages({
    cache,
    icons,
    logger,
    options,
    buildDirectory,
  });

  const manifestPublicUrl = await handleManifest(manifestJsonContent, {
    manifest,
    buildDirectory,
  });

  const htmlWithIcons = html
    .replace('</head>', buildManifestLinkTag(manifestPublicUrl) + '</head>')
    .replace('</head>', imagesHTML + '</head>');

  done('Links of generated icons were injected into HTML');

  return htmlWithIcons;
};
