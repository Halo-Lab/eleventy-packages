import { join } from 'path';

import { pipe, tap } from '@fluss/core';
import {
  done,
  bold,
  start,
  linker,
  promises,
  FileEntity,
  initMemoryCache,
  definePluginName,
  DEFAULT_SOURCE_DIRECTORY,
  DEFAULT_STYLES_DIRECTORY,
  getEleventyOutputDirectory,
} from '@eleventy-packages/common';

import { separateCriticalCSS } from './critical';
import { PluginState, StylesPluginOptions } from './types';
import {
  findStyles,
  writeStyleFile,
  createFileBundler,
  bindLinkerWithStyles,
  createPublicUrlInjector,
} from './bundle';

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
    lessOptions = PluginState.Off,
    inputDirectory = join(DEFAULT_SOURCE_DIRECTORY, DEFAULT_STYLES_DIRECTORY),
    cssnanoOptions = {},
    addWatchTarget = true,
    postcssPlugins = [],
    criticalOptions = PluginState.Off,
    purgeCSSOptions = {},
    publicDirectory = '',
  }: StylesPluginOptions = {},
) => {
  const cache = initMemoryCache<string, Promise<FileEntity>>();

  config.addTransform(
    'styles',
    async function (
      this: Record<string, string>,
      content: string,
      outputPath: string,
    ) {
      const output = this.outputPath ?? outputPath;

      if (output.endsWith('html')) {
        const results = bindLinkerWithStyles(
          linker({
            sassOptions,
            lessOptions,
            outputPath: output,
            baseDirectory: inputDirectory,
            publicDirectory,
            postcssPlugins,
            criticalOptions,
            purgeCSSOptions,
            cssnanoOptions,
          }),
        )(findStyles(content));

        const files = await promises(
          results.map((linkerResult) =>
            cache.through(linkerResult.file.originalUrl, () =>
              pipe(
                tap(() =>
                  start(`Start compiling styles for the ${bold(output)} file.`),
                ),
                createFileBundler(linkerResult),
                writeStyleFile,
                tap((_entity: FileEntity) =>
                  done(
                    `Finished compiling styles for the ${bold(output)} file.`,
                  ),
                ),
              )(content),
            ),
          ),
        );

        const injectors = files
          .filter<PromiseFulfilledResult<FileEntity>>(
            (
              result: PromiseSettledResult<FileEntity>,
            ): result is PromiseFulfilledResult<FileEntity> =>
              result.status === 'fulfilled',
          )
          .map(({ value }) => value)
          .map(createPublicUrlInjector);

        const html = injectors.reduce(
          (html, injectInto) => injectInto(html),
          content,
        );

        if (criticalOptions === PluginState.Off) {
          return html;
        } else {
          return separateCriticalCSS({
            html,
            buildDirectory: getEleventyOutputDirectory(output),
            criticalOptions,
          }).then(({ html }) => html);
        }
      }

      return content;
    },
  );

  config.on('beforeWatch', (changedFiles: ReadonlyArray<string>) =>
    changedFiles
      .filter((relativePath) => /(sc|sa|le|c)ss$/.test(relativePath))
      .forEach(cache.remove),
  );

  if (addWatchTarget) {
    config.addWatchTarget(inputDirectory);
  }
};
