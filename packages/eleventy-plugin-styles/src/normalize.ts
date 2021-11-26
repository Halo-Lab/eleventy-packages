import cssnano from 'cssnano';
import purgecss from '@fullhuman/postcss-purgecss';
import autoprefixer from 'autoprefixer';
import postcss, { AcceptedPlugin } from 'postcss';

import { StylesPluginOptions, PluginState } from './types';

export type NormalizeStepOptions = {
  /** Path of source style file. */
  readonly url: string;
  /** Compiled CSS. */
  readonly css: string;
  /** HTML content that has link to _css_. */
  readonly html: string;
} & Omit<
  StylesPluginOptions,
  'publicDirectory' | 'addWatchTarget' | 'inputDirectory'
>;

/**
 * Process compiled CSS in order to normalize it
 * according to current browsers usability.
 */
export const normalize = async ({
  url: fromUrl,
  css,
  html,
  purgeCSSOptions = {},
  cssnanoOptions = {},
  postcssPlugins = [],
}: NormalizeStepOptions) => {
  // Useful plugins for PostCSS configuration.
  const plugins: AcceptedPlugin[] = [
    ...postcssPlugins,
    purgeCSSOptions !== PluginState.Off
      ? purgecss({
          content: [{ raw: html, extension: 'html' }],
          ...purgeCSSOptions,
        })
      : [],
    autoprefixer,
    cssnanoOptions !== PluginState.Off
      ? (cssnano({ preset: 'default', ...cssnanoOptions }) as AcceptedPlugin)
      : [],
  ].flat();

  return postcss(plugins).process(css, { from: fromUrl });
};
