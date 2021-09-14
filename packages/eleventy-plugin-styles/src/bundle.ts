import { promises } from 'fs';
import { join, resolve, dirname } from 'path';

// @ts-ignore
import * as critical from 'critical';
import { memoize } from '@fluss/core';
import {
  done,
  oops,
  start,
  bold,
  isProduction,
  URL_DELIMITER,
  makeDirectories,
} from '@eleventy-packages/common';

import { rip } from './rip';
import { compile } from './compile';
import { normalize } from './normalize';
import { STYLESHEET_LINK_REGEXP } from './constants';
import { Asset, StylesPluginOptions } from './types';
import { buildOutputUrl, pathStats, resolveFile } from './url';

type BundleOptions = Required<Omit<StylesPluginOptions, 'addWatchTarget'>>;

interface TransformParameters extends Omit<BundleOptions, 'criticalOptions'> {
  readonly html: string;
  readonly inputPath: string;
  readonly nestedHTMLPath: ReadonlyArray<string>;
  readonly buildDirectory: string;
  readonly publicSourcePathToStyle: string;
}

export const transformStylesheet = memoize(
  async ({
    html,
    inputPath,
    sassOptions,
    inputDirectory,
    buildDirectory,
    cssnanoOptions,
    postcssPlugins,
    publicDirectory,
    purgeCSSOptions,
    publicSourcePathToStyle,
  }: TransformParameters) => {
    start(`Start compiling ${bold(publicSourcePathToStyle)}.`);

    const absolutePathToStyle = resolveFile(
      publicSourcePathToStyle,
      inputDirectory,
      dirname(inputPath),
    );
    const publicOutputPathToStyle = buildOutputUrl(
      publicSourcePathToStyle,
      publicDirectory,
    );

    const { css } = compile(absolutePathToStyle, sassOptions);

    return normalize({
      html,
      css,
      url: absolutePathToStyle,
      cssnanoOptions,
      postcssPlugins,
      purgeCSSOptions,
    })
      .then(async ({ css }) => {
        const pathToOutputFile = resolve(
          buildDirectory,
          publicOutputPathToStyle,
        );

        return makeDirectories(dirname(pathToOutputFile)).then(() =>
          promises.writeFile(pathToOutputFile, css, { encoding: 'utf-8' }),
        );
      })
      .then(() =>
        done(
          `Compiled ${bold(publicSourcePathToStyle)} was written to ${bold(
            join(buildDirectory, publicOutputPathToStyle),
          )}`,
        ),
      )
      .then(
        // Creates public path.
        () => URL_DELIMITER + publicOutputPathToStyle,
        oops,
      );
  },
  ({ publicSourcePathToStyle }) => publicSourcePathToStyle,
);

const findAndProcessFiles = (
  html: string,
  inputPath: string,
  outputPath: string,
  options: Omit<BundleOptions, 'criticalOptions'>,
) => {
  const [buildDirectory, ...nestedHTMLPath] = pathStats(outputPath).directories;

  return rip(html, STYLESHEET_LINK_REGEXP).map((link) =>
    transformStylesheet({
      html,
      inputPath,
      buildDirectory,
      nestedHTMLPath,
      publicSourcePathToStyle: link,
      ...options,
    }).then((output) => ({
      input: link,
      output,
    })),
  );
};

export const bundle = async (
  html: string,
  inputPath: string,
  outputPath: string,
  {
    sassOptions,
    cssnanoOptions,
    postcssPlugins,
    inputDirectory,
    purgeCSSOptions,
    publicDirectory,
    criticalOptions,
  }: BundleOptions,
) =>
  Promise.all(
    findAndProcessFiles(html, inputPath, outputPath, {
      sassOptions,
      cssnanoOptions,
      postcssPlugins,
      inputDirectory,
      purgeCSSOptions,
      publicDirectory,
    }),
  )
    .then(
      (array) =>
        array.filter(Boolean) as ReadonlyArray<{
          input: string;
          output: string;
        }>,
    )
    .then(
      (validUrls) => {
        const htmlWithStyles = validUrls.reduce(
          (text, { input, output }) => text.replace(input, output),
          html,
        );

        if (validUrls.length > 0) {
          done(
            `${bold(validUrls.map(({ output }) => output).join(', '))} style ${
              validUrls.length > 1 ? 's were' : 'was'
            } injected into ${bold(outputPath)}.`,
          );
        }

        return htmlWithStyles;
      },
      (error) => (oops(error), html),
    )
    .then((html) => {
      const [buildDirectory] = pathStats(outputPath).directories;

      return isProduction()
        ? critical.generate({
            html,
            base: buildDirectory,
            inline: true,
            extract: true,
            rebase: ({ url, absolutePath }: Asset) =>
              url.startsWith(URL_DELIMITER) ? url : absolutePath,
            penthouse: { timeout: 60000 },
            ...criticalOptions,
          })
        : html;
    })
    .then((result) => {
      if (typeof result === 'string') {
        return { html: result };
      } else {
        done(
          `Critical CSS was injected into ${bold(
            outputPath,
          )} and uncritical styles are deferred.`,
        );
        return result;
      }
    })
    .then(
      ({ html }) => html,
      (error: Error) => (oops(error), html),
    );
