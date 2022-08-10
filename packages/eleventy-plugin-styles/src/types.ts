import purgecss from '@fullhuman/postcss-purgecss';
import { AcceptedPlugin } from 'postcss';
import { Options as CssNanoOptions } from 'cssnano';
import { Options as SassCompilerOptions } from 'sass';

import { CriticalOptions } from './critical';

export enum PluginState {
	Off = 'off',
}

export type PurgeCSSOptions = Parameters<typeof purgecss>[0] | PluginState.Off;

export interface StylesPluginOptions {
	/**
	 * Options that will be passed to [critical](https://github.com/addyosmani/critical)
	 * package.
	 */
	readonly criticalOptions?: CriticalOptions | PluginState.Off;
	/**
	 * Path to directory with all styles.
	 * Should be relative to _current working directory_.
	 */
	readonly inputDirectory?: string;
	/**
	 * Directory inside _output_ folder to be used as
	 * warehouse for all compiled styles. Will be
	 * prepended to public style urls in HTML.
	 */
	readonly publicDirectory?: string;
	/**
	 * Options that can be passed to [`sass`](https://www.npmjs.com/package/sass)
	 * module.
	 */
	readonly sassOptions?: SassCompilerOptions<'sync'> | PluginState.Off;
	/**
	 * Options that can be passed to [`less`](https://www.npmjs.com/package/less)
	 * module.
	 */
	readonly lessOptions?: Less.Options | PluginState.Off;
	/** Options to be passed to [`PurgeCSS`](https://purgecss.com/). */
	readonly purgeCSSOptions?: PurgeCSSOptions | PluginState.Off;
	/** Options to be passed to [`CSSNano`](https://cssnano.co/). */
	readonly cssnanoOptions?: CssNanoOptions | PluginState.Off;
	/** Array of plugins that can be passed to [`PostCSS`](https://postcss.org). */
	readonly postcssPlugins?: ReadonlyArray<AcceptedPlugin>;
	/**
	 * Indicates whether should Eleventy watch on files
	 * under _inputDirectory_ or not.
	 */
	readonly addWatchTarget?: boolean;
}
