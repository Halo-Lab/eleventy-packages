import { resolve as resolvePath } from 'path';
import { readFile } from 'fs/promises';

import { render } from 'less';
import { oops, resolve } from '@eleventy-packages/common';
import { pipe, tryCatch } from '@fluss/core';
import { Options, renderSync } from 'sass';

import { PluginState } from './types';

export enum Language {
  CSS = 'css',
  SASS = 'sass',
  LESS = 'less',
}

type Compiler = <Options extends object>(
  options: Options,
) => (path: string) => Promise<string>;

/**
 * Transform Sass to CSS.
 * It adjusts all Sass files into one CSS file.
 */
const compileSass: Compiler = (options: Options) => async (file) =>
  renderSync({
    file,
    // Allow import styles from installed packages.
    includePaths: [resolvePath('node_modules')],
    ...options,
  }).css.toString('utf8');

const extractCssFromLessResult = ({ css }: Less.RenderOutput): string => css;

/**
 * Transform Less into CSS.
 * Concats multiple files into one.
 */
const compileLess: Compiler = (options: Less.Options) =>
  tryCatch(
    pipe(
      (path: string) => readFile(path, { encoding: 'utf8' }),
      pipe((data: string) => render(data, options), extractCssFromLessResult),
    ),
    (error) => (oops(error), resolve('')),
  );

const compileCSS: Compiler = () => (path: string) =>
  readFile(path, { encoding: 'utf8' });

const LanguageHandler = {
  [Language.CSS]: compileCSS,
  [Language.SASS]: compileSass,
  [Language.LESS]: compileLess,
} as const;

export interface GetCompilerOptions {
  readonly sassOptions: Options | PluginState.Off;
  readonly lessOptions: Less.Options | PluginState.Off;
}

export const getCompiler = ({
  sassOptions,
  lessOptions,
}: GetCompilerOptions): ReturnType<Compiler> =>
  sassOptions !== PluginState.Off
    ? LanguageHandler[Language.SASS](sassOptions)
    : lessOptions !== PluginState.Off
    ? LanguageHandler[Language.LESS](lessOptions)
    : LanguageHandler[Language.CSS]({});
