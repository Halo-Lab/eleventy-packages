# eleventy-plugin-scripts 📜

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Bundles scripts of your site 💪

## Intention

It is not convenient to use a third-party tools like [`gulp`](https://gulpjs.com/), [`webpack`](https://webpack.js.org/) or whatever you know for processing scripts. Yeah 🤨... But why not to intergate this process with [`Eleventy`](https://www.11ty.dev/)? Sounds cool, right 😋!

## Get started

What this plugin can do:

1. Fast bundling your JavaScript or TypeScript files. Thank you [`esbuild`](https://esbuild.github.io)!
2. Setting correct relative paths between HTML and bundled JavaScript.

### Installation

At first do:

```sh
npm i -D eleventy-plugin-scripts
```

and then you can include it into `.eleventy.js`:

```js
const { scripts } = require('eleventy-plugin-scripts');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(scripts, {
    /* Optional options. */
  });
};
```

### Options

Plugin can accept the following options:

```ts
interface ScriptsPluginOptions {
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
```

### Explanation

#### inputDirectory

Plugin extracts URLs to script files from HTML. Therefore your templates should have links to **source** script files.

For example:

```html
<!-- Note that we wrote `main.ts` 👇 -->
<script type="module" src="main.ts"></script>
```

> Plugin recognizes followed extensions: `js` and `ts`. In future may be added much more if you will need it 🤓

After URL extraction plugin will search for these files inside _inputDirectory_ from _options_. So given above example:

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(scripts, {
    // This is a default value
    inputDirectory: 'src/scripts',
  });
};
```

Plugin will assume that path of script file is `src/scripts/main.ts` 🎉 And after all procedures will put compiled file to `_site/main.js` and URL in HTML will be changed to:

```html
<!-- If HTML file is in the same directory if main.js -->
<script type="module" src="main.js"></script>
```

> `_site` is used just for example. Actually [name of the directory will be up to you](https://www.11ty.dev/docs/config/#output-directory) - plugin will know about it.

> If HTML file is in other directory, then referenced script file, plugin will build relative path to it. For example, if output of HTML is `_site/pages/about/index.html` and script's public path is `main.js`(in root of `_site`), then plugin formats public path to `../../main.js`. So you aren't needed to fix URLs to your assets 🤘!

#### publicDirectory

If you want to customize output path of compiled script inside _output_ directory, then you can provide _publicDirectory_ option.

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(scripts, {
    inputDirectory: 'src/scripts',
    publicDirectory: 'scripts',
  });
};
```

Given above example, script file will be placed into `_site/scripts` directory and it's public path will be `scripts/main.js`.

Pretty convenient, yes? 🙂

### addWatchTarget

By default Eleventy will watch for changes inside _inputDirectory_. You have an opportunity to disable it:

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(scripts, {
    // Now Eleventy will not trigger rebuild process
    // if any script changes.
    addWatchTarget: false,
  });
};
```

### esbuildOptions

Internally for bundling scripts is responsible [`esbuild`](https://esbuild.github.io). It bundles each script with all dependencies, that you will reference from templates, into one [ES2018]-compliant file.

You customize its behavior by providing [build options](https://esbuild.github.io/api/#simple-options).

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(scripts, {
    esbuildOptions: {
      /* Some useful options. */
    },
  });
};
```

> Avoid changing `entryPoints` and `outfile` properties, because in HTML may be passed wrong script URL.

## Word from author

Have fun! ✌️

<a href="https://www.halo-lab.com/?utm_source=github-brifinator-3000">
  <img src="https://api.halo-lab.com/wp-content/uploads/dev_halo.svg" alt="Developed in Halo lab" height="60">
</a>
