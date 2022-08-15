# Eleventy Cloudflare Image Resizing plugin

Serve images through Cloudflare Image Resizing service with no hassle.

# Install

```shell
npm i eleventy-plugin-cloudflare-image-resizing
```

# Use

The plugin exports a function for configuring the shortcode:

```js
const createCloudflareImageShortcode = require('eleventy-plugin-cloudflare-image-resizing');

module.exports = (config) => {
	config.addShortcode(
		'cloudflareImage',
		createCloudflareImageShortcode({
			zone: 'https://example.com', // optional
			mode: 'img', // optional, default
			directory: 'cloudflare-images', // optional, default
		}),
	);
};
```

1. _zone_ is the domain name of the website. It may be omitted and the domain will be taken from headers.
2. _mode_ is the default shortcode mode (can be overwritten by the shortcode).
   Plugin supports three modes:
   1. _img_ - shortcode outputs ready to use `<img>` tag.
   2. _url_ - shortcode outputs only final Cloudflare URL.
   3. _attributes_ - shortcode outputs `<img>` ready to use attributes as the object.
3. _directory_ is the name of the directory under the _output_ which will contain referenced images.
   Plugin copies images from source to the _output_ directory by itself. **Don't use the _addPassthroughCopy_ option
   with images that are referenced by the plugin because you may end up with two copies.**

### Shortcode has the following signature:

```js
const result = cloudflareImage(url, options);
```

1. _url_ - it is the relative path to the image from the current page. You may set another relative _from_
   point by providing _relativeTo_ property in _options_.
2. _options_ - it includes [all options](https://developers.cloudflare.com/images/image-resizing/url-format/#options) that Cloudflare URL may accept and several additional options like:
   1. _relativeTo_ - see above.
   2. _emit_ - overrides the global _mode_ option and accepts the same values.
   3. _densities_ - list of all image densities for the _srcset_ attribute. (_sizes_ shouldn't be defined)
   4. _sizes_ - list of all required image widths for the _srcset_ attribute. (_densities_ shouldn't be defined)
   5. _attributes_ - a map of all additional `<img>` attributes.

> _srcset_ attribute if defined in the _attributes_ is not used if _densities_ or _sizes_ is provided.

## Word from author

Have fun ✌️

<a href="https://www.halo-lab.com/?utm_source=github-brifinator-3000">
  <img src="https://api.halo-lab.com/wp-content/uploads/dev_halo.svg" alt="Developed in Halo lab" height="60">
</a>
