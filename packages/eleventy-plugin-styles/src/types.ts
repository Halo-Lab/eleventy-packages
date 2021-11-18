import purgecss from '@fullhuman/postcss-purgecss';
import { SassCompilerOptions } from './compile';
import { NormalizeStepOptions } from './normalize';

/** Object that is passed to rebase function in critical package. */
export interface Asset {
  readonly url: string;
  readonly hash: string;
  readonly search: string;
  readonly pathname: string;
  readonly relativePath: string;
  readonly absolutePath: string;
}

interface CriticalOptions {
  readonly css?: ReadonlyArray<string>;
  readonly src?: string;
  readonly user?: string;
  readonly pass?: string;
  readonly base?: string;
  readonly html?: string;
  readonly width?: number;
  readonly height?: number;
  readonly inline?: boolean | object;
  readonly target?: string | object;
  readonly strict?: boolean;
  readonly rebase?: object | ((asset: Asset) => string);
  readonly ignore?: ReadonlyArray<object>;
  readonly request?: object;
  readonly extract?: boolean;
  readonly userAgent?: string;
  readonly penthouse?: object;
  readonly assetPaths?: ReadonlyArray<string>;
  readonly dimensions?: ReadonlyArray<{ width: number; height: number }>;
  readonly inlineImages?: boolean;
  readonly maxImageFileSize?: number;
}

export enum PluginState {
  Off = "off",
}

export type PurgeCSSOptions = Parameters<typeof purgecss>[0] | PluginState.Off;

export type StylesPluginOptions = {
  /**
   * Options that will be passed to [critical](https://github.com/addyosmani/critical)
   * package.
   */
  criticalOptions?: CriticalOptions;
  /**
   * Path to directory with all styles.
   * Should be relative to _current working directory_.
   */
  inputDirectory?: string;
  /**
   * Directory inside _output_ folder to be used as
   * warehouse for all compiled styles. Will be
   * prepended to public style urls in HTML.
   */
  publicDirectory?: string;
  /**
   * Options that can be passed to [`sass`](https://www.npmjs.com/package/sass)
   * module.
   */
  sassOptions?: SassCompilerOptions;
  /**
   * Indicates whether should Eleventy watch on files
   * under _inputDirectory_ or not.
   */
  addWatchTarget?: boolean;
} & Pick<
  NormalizeStepOptions,
  'cssnanoOptions' | 'postcssPlugins' | 'purgeCSSOptions'
>;
