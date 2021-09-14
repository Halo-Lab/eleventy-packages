import { join } from 'path';

import {
  done,
  definePluginName,
  DEFAULT_SOURCE_DIRECTORY,
  DEFAULT_STYLES_DIRECTORY,
} from '@eleventy-packages/common';

import { bundle, transformStylesheet } from './bundle';
import type { StylesPluginOptions } from './types';

definePluginName('Styles');

/**
 * Plugin that searches for links to stylesheets inside HTML,
 * compiles, normalizes and minficates them. After that - writes
 * to the _output_ directory.
 */
export const styles = (
  config: Record<string, Function>,
  {
    sassOptions = {},
    inputDirectory = join(DEFAULT_SOURCE_DIRECTORY, DEFAULT_STYLES_DIRECTORY),
    cssnanoOptions = {},
    addWatchTarget = true,
    postcssPlugins = [],
    criticalOptions = {},
    purgeCSSOptions = {},
    publicDirectory = '',
  }: StylesPluginOptions = {},
) => {
  config.addTransform(
    'styles',
    async function (
      this: Record<string, string>,
      content: string,
      outputPath: string,
    ) {
      const output = this.outputPath ?? outputPath;

      if (output.endsWith('html')) {
        return bundle(content, this.inputPath, output, {
          sassOptions,
          inputDirectory,
          cssnanoOptions,
          postcssPlugins,
          criticalOptions,
          purgeCSSOptions,
          publicDirectory,
        });
      }

      return content;
    },
  );

  config.on('beforeWatch', (changedFiles: ReadonlyArray<string>) => {
    if (
      changedFiles.some((relativePath) => /(sc|sa|c)ss$/.test(relativePath))
    ) {
      // Rebuild styles if they are changed.
      transformStylesheet.cache.clear();
    } else {
      done('No stylesheet file was changed. Skips compilation.');
    }
  });

  if (addWatchTarget) {
    config.addWatchTarget(inputDirectory);
  }
};
