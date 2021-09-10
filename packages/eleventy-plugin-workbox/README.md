# eleventy-plugin-workbox 💼

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Cache your site to stay up in offline! ✊

## Intention

This plugin aims to be as configurable as you want and has ability to inject service worker registration script into HTML.

## Get started

> **Warning**: plugin uses [build events](https://www.11ty.dev/docs/events/#afterbuild) that are available in Eleventy from `0.11.1` version. So versions below are not supported!

### Installation

At first do:

```sh
npm i -D eleventy-plugin-workbox
```

And then add plugin to _eleventyConfig_ object in `.eleventy.js`.

```js
const { cache } = require('eleventy-plugin-workbox');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(cache, {
    /* Options are optional. */
  });
};
```

### Options

Plugin can accept options:

```ts
interface EleventyPluginWorkboxOptions {
  /**
   * Options that will be passed to
   * [`generateSW` function](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW).
   */
  generateSWOptions?: GenerateSWConfig;
  /**
   * Directory inside _output_ folder to be used as place for
   * service worker.
   */
  publicDirectory?: string;
  /**
   * Scope for service worker.
   * Default `/`.
   */
  scope?: string;
  /**
   * Tells if plugin should generate service worker.
   * Useful for situations when there is a need to test service worker,
   * especially in development process.
   *
   * By default, it is enabled if `NODE_ENV === 'production'`.
   */
  enabled?: boolean;
}
```

> If your templates are generated into `index.html` files, then you can refer them with a directory name. In that case you **should** append `/` to directory name. Without it service worker can not reach `index.html` files.

### What's special?

1. This plugin uses [`workbox`](https://developers.google.com/web/tools/workbox/) to cache assets.

   > _Assets_ is all HTML files, JavaScript, CSS, JSON, images and fonts. For detailed list of file extensions check `src/constants.ts`.

2. It differentiates between _static_(images and fonts) and _dynamic_(JavaScript, CSS, HTML, JSON) assets. They are treated differently:

   - for _static_ assets plugin uses [`StaleWhileRevalidate`](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-strategies#stalewhilerevalidate) due to assumption that such resources are changed rarely.
   - for _dynamic_ assets plugin uses [`NetworkFirst`](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-strategies#networkfirst) strategy, because this resources may change frequently.

   > This is a default behavior and can be easily changed.

3. It automatically injects service worker registration script into each generated HTML, so you must not do it manually. Perfect 😀!

> Note: if you will also use [`afterBuild` event](https://www.11ty.dev/docs/events/#afterbuild) to write some logic, be sure that your plugin is added before this plugin. Otherwise there may be inconsistencies in cached resources, if your plugin somehow changes them.

4. It precaches URLs as absolute from root of site. It is very handy when Eleventy makes many directories for HTML files and you have only one place for each type of asset.

## Word from author

Have fun! ✌️

<a href="https://www.halo-lab.com/?utm_source=github-brifinator-3000">
    <img src="https://api.halo-lab.com/wp-content/uploads/dev_halo.svg" alt="Developed in Halo lab" height="60">
</a>
