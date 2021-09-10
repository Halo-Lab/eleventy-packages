const path = require('path');

const { extensionOf } = require('./extension_of');

/** List of script formats. */
const SCRIPT_FORMATS = ['js', 'ts', 'cjs', 'mjs'];
/** List of style formats. */
const STYLE_FORMATS = ['css', 'scss', 'sass'];
/** List of image formats. */
const IMAGE_FORMATS = [
  'jpg',
  'png',
  'gif',
  'ico',
  'svg',
  'jpeg',
  'avif',
  'webp',
];
/** List of font formats. */
const FONT_FORMATS = ['eot', 'ttf', 'otf', 'ttc', 'woff', 'woff2'];

/**
 * Check if url's file is script.
 *
 * @param {string} url
 */
const isScript = (url) => SCRIPT_FORMATS.includes(extensionOf(url));

/**
 * Check if url's file is style.
 *
 * @param {string} url
 */
const isStyle = (url) => STYLE_FORMATS.includes(extensionOf(url));

/**
 * Check if url's file is image.
 *
 * @param {string} url
 */
const isImage = (url) => IMAGE_FORMATS.includes(extensionOf(url));

/**
 * Check if url points to SVG.
 *
 * @param {string} url
 */
const isSVG = (url) => 'svg' === extensionOf(url);

/**
 * Check if url's file is font.
 *
 * @param {string} url
 */
const isFont = (url) => FONT_FORMATS.includes(extensionOf(url));

/**
 * Get format/formats of image.
 *
 * Due to poor browser supports of `avif` and `tiff` images,
 * these formats are not included in output format and by
 * default they will be converted to supported formats.
 *
 * Formats that are accepted by plugin: https://www.11ty.dev/docs/plugins/image/
 *
 * @param {string} extension
 */
const getImageFormatsFrom = (extension) => {
  switch (extension) {
    case 'png':
      return ['png', 'webp', 'avif'];
    case 'svg':
      // Do not convert vector image to raster image.
      return ['svg'];
    default:
      return ['jpeg', 'webp', 'avif'];
  }
};

/**
 * We should replace extension in order to insert proper one.
 * @11ty/eleventy-img generates only subset of known extensions
 * and we should take one of them. For example, replace _jpg_ with
 * _jpeg_. Also due to not wide support of `webp` and `avif` formats
 * in CSS, we are forced to use older formats: `png` and `jpeg`.
 */
const adjustExtension = (url) =>
  path.join(
    path.dirname(url),
    path.basename(url, extensionOf(url, true)) +
      '.' +
      // We can safely take first element from array,
      // because there always will be at least one element.
      getImageFormatsFrom(extensionOf(url))[0]
  );

module.exports = {
  isSVG,
  isFont,
  isImage,
  isStyle,
  isScript,
  adjustExtension,
  getImageFormatsFrom,

  FONT_FORMATS,
  IMAGE_FORMATS,
  STYLE_FORMATS,
  SCRIPT_FORMATS,
};
