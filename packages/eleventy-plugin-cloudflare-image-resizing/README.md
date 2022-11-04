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
			bypass: () => process.env.NODE_ENV !== 'production', // optional, default
			cloudflareURL: () => zone + '/' + 'image' + originalURL // optional, usage example
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
4. _bypass_ is a function that determines which image URL should be returned either from the Cloudflare service (for 
	 the production environment, by default) or from the local directory (see directory option). 
   This function must return a boolean value. If true, a returned URL points to the Cloudflare service, otherwise - 
	 the local directory.
5. _cloudflareURL_ is a function that allows you to customize your cloudflare URL.
	 cloudflareURL must have the following arguments: 
   * _zone_
   * _domain_
   * _options_ - cloudflare URL options like: format, quality, width, anim, etc.
   * _originalURL_ - URL of your image

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
   6. _domain_ is the domain that acts as a place from where images are taken.
			It may be omitted, and in that case, it will be implying that images are hosted on the current domain (which serves
			the whole website).

> _srcset_ attribute if defined in the _attributes_ is not used if _densities_ or _sizes_ is provided.

## Word from author

Have fun ✌️

<a href="https://www.halo-lab.com/?utm_source=github-brifinator-3000">
  <img src="https://api.halo-lab.com/wp-content/uploads/dev_halo.svg" alt="Developed in Halo lab" height="60">
</a>
