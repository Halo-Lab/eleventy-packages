export interface TransformOptions {
  icons?: {
    /**
     * Path to source image for PWA icons.
     * By default, it is `src/icon.png`.
     *
     * Should be relative to _current working directory_.
     */
    pathToRawImage?: string;
    /**
     * Public directory into which to output all PWA icons.
     *
     * Should be relative to _output_ directory.
     */
    publicDirectory?: string;
  };
  manifest?: {
    /**
     * Path to `manifest.json` file.
     * By default, it is `src/manifest.json`.
     *
     * Should be relative to _current working directory_.
     */
    pathToManifest?: string;
    /**
     * Public directory into which to output updated `manifest.json`.
     *
     * Should be relative to _output_ directory.
     */
    publicDirectory?: string;
  };
}
