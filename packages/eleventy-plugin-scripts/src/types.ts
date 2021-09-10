import { BuildOptions } from 'esbuild';

export interface ScriptsPluginOptions {
  /**
   * Path to directory with all scripts
   * Should be relative to _current working directory_.
   */
  inputDirectory?: string;
  /**
   * Directory inside _output_ folder to be used as
   * warehouse for all compiled scripts. Will be
   * prepended to public script urls in HTML.
   */
  publicDirectory?: string;
  /**
   * Options that can be passed to [`esbuild`](https://esbuild.github.io).
   */
  esbuildOptions?: BuildOptions;
  /**
   * Indicates whether should Eleventy watch on files
   * under _inputDirectory_ or not.
   */
   addWatchTarget?: boolean;
}
