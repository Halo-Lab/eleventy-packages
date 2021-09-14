import { join } from 'path';

import {
  done,
  definePluginName,
  DEFAULT_SOURCE_DIRECTORY,
  DEFAULT_SCRIPTS_DIRECTORY,
} from '@eleventy-packages/common';

import { ScriptsPluginOptions } from './types';
import { bundle, transformFile } from './bundle';

definePluginName('Scripts');

/**
 * Plugin that searches for links to scripts inside HTML,
 * compiles and minifies them. After that - writes
 * to the _output_ directory.
 */
export const scripts = (
  config: Record<string, Function>,
  {
    inputDirectory = join(DEFAULT_SOURCE_DIRECTORY, DEFAULT_SCRIPTS_DIRECTORY),
    esbuildOptions = {},
    publicDirectory = '',
    addWatchTarget = true,
  }: ScriptsPluginOptions = {},
) => {
  config.addTransform(
    'scripts',
    async function (
      this: Record<string, any>,
      content: string,
      outputPath: string,
    ) {
      const output = this.outputPath ?? outputPath;

      return output.endsWith('html')
        ? bundle(content, output, {
            inputDirectory,
            publicDirectory,
            esbuildOptions,
          })
        : content;
    },
  );

  config.on('beforeWatch', (changedFiles: ReadonlyArray<string>) => {
    if (
      changedFiles.some(
        (file) => file.includes(inputDirectory) && /(ts|js)$/.test(file),
      )
    ) {
      transformFile.cache.clear();
    } else {
      done('No script file was changed. Skip compilation.');
    }
  });

  if (addWatchTarget) {
    config.addWatchTarget(inputDirectory);
  }
};
