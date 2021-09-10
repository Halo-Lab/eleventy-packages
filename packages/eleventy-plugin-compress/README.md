# eleventy-plugin-compress 👜

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Compresses HTML and assets (CSS, JavaScript) that are referenced from it with [`brotli`](https://brotli.org), [`gzip`](http://www.gzip.org) and [`deflate`](https://en.wikipedia.org/wiki/Deflate) algorithms.

## Intention

Even big assets(pages, scripts, styles) should be delivered to client quickly. In order to do that, they must be compressed ☝️! ... At least.

## Get started

### Installation

At first run:

```sh
npm i -D eleventy-plugin-compress
```

and eventually add to Eleventy as plugin:

```js
const { compress } = require('eleventy-plugin-compress');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(compress, {
    /* Optional options. */
  });
};
```

> Important: you should register plugin after any other plugins or [`transform`](https://www.11ty.dev/docs/config/#transforms) functions!

### Options

The plugin can accept following options:

```ts
type CompressAlgorithm = 'brotli' | 'gzip' | 'deflate';

interface CompressPluginOptions {
  /**
   * Signals whether this plugin should do its job.
   * By default, it is on in production environment.
   */
  enabled?: boolean;
  algorithm?: CompressAlgorithm | ReadonlyArray<CompressAlgorithm>;
}
```

You can choose one of some algorithms to compress assets. By default, `brotli` is used.

> For proper work of this plugin, it is assumed that in time of compiling HTML all CSS and JavaScript are already processed and folded into [_output_](https://www.11ty.dev/docs/config/#output-directory) directory.

## Word from author

Have fun! ✌️

<a href="https://www.halo-lab.com/?utm_source=github-brifinator-3000">
  <img src="https://api.halo-lab.com/wp-content/uploads/dev_halo.svg" alt="Developed in Halo lab" height="60">
</a>
