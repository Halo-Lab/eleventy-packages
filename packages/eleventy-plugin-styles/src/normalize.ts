import purgecss from '@fullhuman/postcss-purgecss';
import autoprefixer from 'autoprefixer';
import postcss, { AcceptedPlugin } from 'postcss';
import cssnano, { CssNanoOptions } from 'cssnano';
import { PurgeCSSOptions, PluginState } from './types';

export interface NormalizeStepOptions {
  /** Path of source style file. */
  url: string;
  /** Compiled CSS. */
  css: Buffer;
  /** HTML content that has link to _css_. */
  html: string;
  /** Options to be passed to [`PurgeCSS`](https://purgecss.com/). */
  purgeCSSOptions?: PurgeCSSOptions;
  /** Options to be passed to [`CSSNano`](https://cssnano.co/). */
  cssnanoOptions?: CssNanoOptions;
  /** Array of plugins that can be passed to [`PostCSS`](https://postcss.org). */
  postcssPlugins?: ReadonlyArray<AcceptedPlugin>;
}

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
  const plugins: any[] = [
    ...postcssPlugins,
    (purgeCSSOptions !== PluginState.Off) ? purgecss({
      content: [{ raw: html, extension: 'html' }],
      ...purgeCSSOptions,
    }) : null,
    autoprefixer,
    cssnano({ preset: 'default', ...cssnanoOptions }),
  ].filter(Boolean);;

  return postcss(plugins).process(css, { from: fromUrl });
};
