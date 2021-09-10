import { resolve } from 'path';

import { Options, renderSync } from 'sass';

export type SassCompilerOptions = Options;

/** 
 * Transform Sass to CSS.
 * It adjusts all Sass files into one CSS file.
 */
export const compile = (url: string, options: SassCompilerOptions = {}) =>
  renderSync({
    file: url,
    // Allow import styles from installed packages.
    includePaths: [resolve('node_modules')],
    ...options,
  });
