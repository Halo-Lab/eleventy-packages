# eleventy-plugin-styles 🍭

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Compiles and normalizes styles of your site 💪

## Intention

Why should we use third-party tools like [`gulp`](https://gulpjs.com/), [`webpack`](https://webpack.js.org/) or whatever you know for processing stylesheets if we can delegate it to [`Eleventy`](https://www.11ty.dev/)? Cool, right 😋!

## Get started

What this plugin can do:

1. Automatically reaches your styles, even from `node_modules`!

   > In order to import style from package, simply write `@(import|use) 'package_name/path/to/style';` 👐

2. Compiles `less`, `sass` and `scss`.

   > Plugin uses new [`sass`](https://www.npmjs.com/package/sass) package and [`less`](https://lesscss.org) preprocessor, that allow you to use your favourite language for the CSS.

3. Normalizes compiled CSS with [`PostCSS`](https://postcss.org/), [`autoprefixer`](https://www.npmjs.com/package/autoprefixer), gets rid of unused style rules with [`PurgeCSS`](https://purgecss.com/) and minifies CSS with [`cssnano`](https://cssnano.co/). And you can add much more [plugins](https://www.postcss.parts/)!

4. Sets correct paths between HTML and CSS.

5. Separates critical styles and uncritical ones. Thanks to [critical](https://github.com/addyosmani/critical) package.

### Installation

At first do:

```sh
npm i -D eleventy-plugin-styles
```

and then you can include it into `.eleventy.js`:

```js
const { styles } = require('eleventy-plugin-styles');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(styles, {
    /* Optional options. */
  });
};
```

### Options

Plugin can accept the following options:

```ts
interface StylesPluginOptions {
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
  readonly sassOptions?: SassCompilerOptions | PluginState.Off;
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
```

### Explanation

#### inputDirectory

Plugin extracts links to stylesheet files from HTML. Therefore, your templates should have links to **source** style files.

For example:

```html
<!-- Note that we wrote `styles.scss` 👇 -->
<link rel="stylesheet" href="style.scss" />
```

> Plugin recognizes followed extensions: `css`, `less`, `sass` and `scss`. In future may be added much more if you will need it 🤓

After links extraction plugin will search for these files inside _inputDirectory_ from _options_. So given above example:

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(styles, {
    inputDirectory: 'src/styles',
  });
};
```

Plugin will assume that path style file is `src/styles/style.scss` 🎉 And after all procedures will put compiled file to `_site/style-[hash].css` and link in HTML will be changed to:

```html
<!-- If HTML file is in the same directory if style.css -->
<link rel="stylesheet" href="/style-[hash].css" />
```

> `_site` is used just for example. Actually [name of the directory will be up to you](https://www.11ty.dev/docs/config/#output-directory) - plugin will know about it.

You can write relative path to styles if you prefer such style. For example, if your template path is `src/templates/template.11ty.js` and path to style file is `src/styles/style.scss`, then:

```html
<link rel="stylesheet" href="../styles/style.scss" />
```

> If path starts with leading slash (`/`), then it will be removed.

#### publicDirectory

If you want to customize output path of compiled style inside _output_ directory, then you can provide _publicDirectory_ option.

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(styles, {
    inputDirectory: 'src/styles',
    publicDirectory: 'styles',
  });
};
```

Given above example, stylesheet file will be placed into `_site/styles` directory, and its public path will be `styles/style-[hash].css`.

Pretty convenient, yes? 🙂

### addWatchTarget

By default, Eleventy will watch for changes inside _inputDirectory_. You have an opportunity to disable it:

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(styles, {
    // Now Eleventy will not trigger rebuild process
    // if any style changes.
    addWatchTarget: false,
  });
};
```

### sassOptions

Plugin supports [`sass`](https://sass-lang.com/) preprocessor.

If you want to customize its behavior then [options](https://www.npmjs.com/package/sass#api) need to be passed to plugin.

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(styles, {
    sassOptions: {
      /* Some useful options. */
    },
  });
};
```

Plugin uses this preprocessor as the default language for CSS. You can disable it by providing `off` value instead of _options_.

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(styles, {
    sassOptions: 'off',
  });
};
```

> Avoid changing `file` property, because provided stylesheet will be inserted into all your HTML pages, instead of referenced ones. Bad situation ☹️. Also if you want to override `includePaths` property, then make sure you add `node_modules` to array (this is a default value).

### lessOptions

Plugin supports [`less`](https://lesscss.org/) preprocessor.

If you want to customize its behavior then [options](https://lesscss.org/usage/#less-options) need to be passed to plugin.

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(styles, {
    lessOptions: {
      /* Some useful options. */
    },
  });
};
```

Or disable it by providing the `off` value.

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(styles, {
    lessOptions: 'off',
  });
};
```

> If you want to use this preprocessor, then you should disable `sass` preprocessor at first.

### purgeCSSOptions

[PurgeCSS](https://purgecss.com/) is included as a plugin to [PostCSS](https://postcss.org/).

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(styles, {
    purgeCSSOptions: {
      /* Some useful options. */
    },
  });
};
```

You can disable the plugin by passing `'off'` as an option, like this:

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(styles, {
    purgeCSSOptions: 'off',
  });
};
```

> Avoid overriding `content` property and `css`, because they are used internally and that may cause unexpected results.

### cssnanoOptions

[cssnano](https://cssnano.co/) is included as a plugin to [PostCSS](https://postcss.org/).

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(styles, {
    cssnanoOptions: {
      /* Some useful options. */
    },
  });
};
```

You can disable the plugin by passing `'off'` as an option, like this:

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(styles, {
    cssnanoOptions: 'off',
  });
};
```

By default it uses [`default preset`](https://cssnano.co/docs/optimisations) for CSS optimization.

### postcssPlugins

[cssnano](https://cssnano.co/) is included as a plugin to [PostCSS](https://postcss.org/).

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(styles, {
    postcssPlugins: [
      /* Some useful plugins. */
    ],
  });
};
```

> By providing additional plugins `purgeCSS` and `cssnano` plugins will not be removed, so if you want to change their behavior provide according options as described above ☝️.

### criticalOptions

[critical](https://github.com/addyosmani/critical) is included. By default, it works in `production` mode and if `criticalOptions` property is not equal to `'off'` value (that disables the plugin).

```js
// .eleventy.js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(styles, {
    criticalOptions: {
      /* Some useful options. */
    },
  });
};
```

By default, it inlines critical styles into HTML and defers loading uncritical styles. It extracts critical styles from linked stylesheets, so you can safely import the same stylesheet file into multiple templates.

> Tip: `critical` tries its best to rebase assets in styles, but it won't touch assets that have absolute public URL 🤗.

## Word from author

Have fun! ✌️

<a href="https://www.halo-lab.com/?utm_source=github-brifinator-3000">
  <img src="https://api.halo-lab.com/wp-content/uploads/dev_halo.svg" alt="Developed in Halo lab" height="60">
</a>
