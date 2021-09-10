const path = require('path');

const Image = require('@11ty/eleventy-img');
const { optimize, extendDefaultPlugins } = require('svgo');

const read = require('./read');
const write = require('./write');
const makeDirectories = require('./mkdir');
const { extensionOf } = require('./extension_of');
const { isSVG, getImageFormatsFrom } = require('./formats');
const { reachFromSource, reachFromBuild } = require('./reach');
const { IMAGES_DIRECTORY, ASSETS_DIRECTORY } = require('../constants');

/**
 * Build options for raster image optimizer
 * based on image extension.
 *
 * @param {string} name of image.
 */
const getDefaultRasterOptimizerOptions = (name) => ({
  widths: [null],
  formats: getImageFormatsFrom(extensionOf(name)),
  outputDir: reachFromBuild(IMAGES_DIRECTORY, path.dirname(name)),
  sharpPngOptions: {
    quality: 100,
    progressive: true,
  },
  sharpJpegOptions: {
    quality: 100,
    progressive: true,
  },
  sharpWebpOptions: {
    quality: 100,
    // Use near_lossless compression mode.
    nearLossLess: true,
  },
  sharpAvifOptions: {
    quality: 100,
  },
  filenameFormat: (id, src, width, format) =>
    `${path.basename(src, extensionOf(src, true))}.${format}`,
});

/**
 * Optimize SVG handler.
 *
 * @param {string} url
 * @param {ReadonlyArray<string>} [classNames]
 */
const optimizeSVG = (url, classNames = []) =>
  read(ASSETS_DIRECTORY, IMAGES_DIRECTORY, url)
    .then(({ url, source }) =>
      optimize(source, {
        path: url,
        plugins: extendDefaultPlugins([
          {
            name: 'addClassesToSVGElement',
            active: classNames.length > 0,
            params: {
              classNames,
            },
          },
          // Preserve view-box attribute on <svg> for proper resizing of SVG
          // through CSS.
          {
            name: 'removeViewBox',
            active: false,
          },
          // Remove width and height attributes from <svg>
          {
            name: 'removeDimensions',
            active: true,
          },
          // Add name of SVG to id for create unique IDs if many SVGs will be present in page
          {
            name: 'prefixIds',
            active: true,
          },
        ]),
      })
    )
    .then(({ data }) => write(data, IMAGES_DIRECTORY, url));

// A same image can be imported in more than one
// style file, so we should check if it was already
// optimized.
// TODO: think about caching. Should it be plugin's functionality?
const cache = new Set();

/**
 * Gets metadata about image. This function defines options for sharp
 * package for generating optimized images.
 *
 * @param {string} url - path to image in source's images directory
 * @param {ReadonlyArray<string>} [classNames] - classes to be added to SVG.
 */
module.exports = async (url, classNames = []) => {
  if (cache.has(url)) {
    return;
  } else {
    cache.add(url);
  }

  const inputPath = reachFromSource(ASSETS_DIRECTORY, IMAGES_DIRECTORY, url);
  const outputPath = reachFromBuild(IMAGES_DIRECTORY, url);

  const options = getDefaultRasterOptimizerOptions(url);

  return makeDirectories(path.dirname(outputPath)).then(() =>
    // Though Image function can accept SVGs, but it does not optimize them.
    // So, we need to filter SVG and handle them separately.
    isSVG(url) ? optimizeSVG(url, classNames) : Image(inputPath, options)
  );
};
