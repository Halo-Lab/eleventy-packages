import { promises } from 'fs';
import { join, resolve } from 'path';

import { memoize, pipe } from '@fluss/core';
import { build, BuildResult } from 'esbuild';
import {
  rip,
  not,
  bold,
  done,
  oops,
  start,
  mkdir,
  isRemoteLink,
  isProduction,
  URL_DELIMITER,
} from '@eleventy-packages/common';

import { pathStats } from './path_stats';
import { SCRIPTS_LINK_REGEXP } from './constants';
import { ScriptsPluginOptions } from './types';

const { writeFile } = promises;

type BundleOptions = Required<Omit<ScriptsPluginOptions, 'addWatchTarget'>>;

interface TransformFileOptions extends BundleOptions {
  readonly nestedHTMLPath: ReadonlyArray<string>;
  readonly buildDirectory: string;
  readonly publicSourcePathToScript: string;
}

export const transformFile = memoize(
  ({
    inputDirectory,
    nestedHTMLPath,
    buildDirectory,
    esbuildOptions,
    publicDirectory,
    publicSourcePathToScript,
  }: TransformFileOptions) => {
    start(`Start compiling "${bold(publicSourcePathToScript)}" file.`);

    const pathToScriptFromRoot = join(inputDirectory, publicSourcePathToScript);
    const publicFileName = publicSourcePathToScript.replace(/ts$/, 'js');

    return pipe(
      () => resolve(buildDirectory, publicDirectory, publicSourcePathToScript),
      mkdir,
      () =>
        build({
          write: false,
          bundle: true,
          target: 'es2018',
          minify: isProduction(),
          outdir: join(buildDirectory, publicDirectory),
          outbase: inputDirectory,
          format: 'esm',
          splitting: true,
          sourcemap: !isProduction(),
          entryPoints: [pathToScriptFromRoot],
          ...esbuildOptions,
        }),
      ({ outputFiles = [] }: BuildResult) =>
        outputFiles.map((file) =>
          writeFile(file.path, file.text).then(() => file.path),
        ),
      (paths) => Promise.all(paths),
      (paths: ReadonlyArray<string>) =>
        void done(
          `Compiled "${bold(publicSourcePathToScript)}" script${
            paths.length > 1 ? 's were' : 'was'
          } written to "${bold(
            paths
              // We get rid of "map" file.
              .filter((pathPart) => !pathPart.endsWith('.map'))
              .map((pathPart) => pathPart.replace(process.cwd(), ''))
              .join(', '),
          )}"`,
        ),
      () =>
        nestedHTMLPath
          .map(() => '..')
          .concat(publicDirectory)
          .concat(publicFileName)
          .filter(Boolean)
          .join(URL_DELIMITER),
    )();
  },
  ({ publicSourcePathToScript }) => publicSourcePathToScript,
);

const findAndProcessFiles = (
  html: string,
  outputPath: string,
  { inputDirectory, esbuildOptions, publicDirectory }: BundleOptions,
) => {
  const [buildDirectory, ...nestedHTMLPath] = pathStats(outputPath).directories;

  return rip(html, SCRIPTS_LINK_REGEXP, pipe(isRemoteLink, not)).map((link) =>
    transformFile({
      inputDirectory,
      publicDirectory,
      esbuildOptions,
      buildDirectory,
      nestedHTMLPath,
      publicSourcePathToScript: link,
    }).then((output) => ({
      output,
      input: link,
    })),
  );
};

/** Compile, bundle and minify script. */
export const bundle = async (
  html: string,
  outputPath: string,
  options: BundleOptions,
) =>
  Promise.all(findAndProcessFiles(html, outputPath, options))
    .then((array) => array.filter(Boolean))
    .then(
      (validUrls) => {
        const htmlWithScripts = validUrls.reduce(
          (text, { input, output }) => text.replace(input, output),
          html,
        );

        if (validUrls.length > 0) {
          done(
            `${validUrls
              .map(({ output }) => `"${bold(output)}"`)
              .join(', ')} URL${
              validUrls.length === 1 ? ' was' : 's were'
            } injected into "${bold(outputPath)}"`,
          );
        }

        return htmlWithScripts;
      },
      (error) => (oops(error), html),
    );
