# eleventy-plugin-pwa-icons 🎨

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Generates icons and splash screen images, favicons and mstile images. Updates `manifest.json` and every HTML file with the generated images according to [Web App Manifest specs](https://www.w3.org/TR/appmanifest/) and [Apple Human Interface guidelines](https://developer.apple.com/design/human-interface-guidelines/).

## Intention

Every [PWA](https://en.wikipedia.org/wiki/Progressive_web_application) needs icons either it is aimed for a mobile or a desktop application 💁‍♂️

## Get started

> This plugin uses [`pwa-assets-generator`](https://github.com/onderceylan/pwa-asset-generator) under the hood, so, we recommend to read about it first 🥸.

### Installation

At first run:

```sh
npm i -D eleventy-plugin-pwa-icons
```

and eventually add to Eleventy as plugin:

```js
const { icons } = require('eleventy-plugin-pwa-icons');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(icons, {
    /* Optional options. */
  });
};
```

### Options

The plugin can accept following options:

```ts
interface PWAIconsOptions {
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
  /**
   * Controls whether plugin should work or not.
   * By default, it is enabled in _production_ mode.
   */
  enabled?: boolean;
  /** Logs a result of generated items to whatever you want. */
  logger?: LoggerFunction;
  /**
   * Options that control work of [pwa-asset-generator](https://www.npmjs.com/package/pwa-asset-generator).
   *
   * See [here](https://github.com/onderceylan/pwa-asset-generator) about available options.
   */
  generatorOptions?: Options;
}
```

By default output directory for icons is _your_build_directory/icons/_.

Default path for manifest output - _your_build_directory/manifest.json_.

That is all 👐 The plugin will do a remaining dirty job by itself.

## Word from author

Have fun! ✌️

<a href="https://www.halo-lab.com/?utm_source=github-brifinator-3000">
    <img src="https://api.halo-lab.com/wp-content/uploads/dev_halo.svg" alt="Developed in Halo lab" height="60">
</a>
