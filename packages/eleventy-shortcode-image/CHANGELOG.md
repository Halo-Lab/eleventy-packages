# [1.7.1] - 2022-03-07

This release is forced by [npm regression bug](https://github.com/npm/cli/issues/4126). The previous release pushed wrong files into the registry.

## [1.7.0] - 2022-03-07

### Added

- `shouldDeleteViewBox` and `shouldDeleteDimensions` properties to `svgOptions` and `imageProperties` objects.

## [1.6.2] - 2021-12-21

### Changed

- Update `@11ty/eleventy-img` and `svgo` dependencies.

## [1.6.0] - 2021-09-13

### Changed

- In non-production mode all images are moved to the _output_ folder as is. It is done in order to speed-up start of development server.

### Fixed

- Overriding build-in plugins with a [new `preset-default` Plugin API](https://github.com/svg/svgo#configuration).

## [1.5.3] - 2021-07-29

### Added

- `srcset` attribute to \<img> element in \<picture>.

### Fixed

- Defining `src` attribute on \<img> element with `lazy: true`.

## [1.5.2] - 2021-07-29

### Fixed

- Renaming images caused rewriting different variants with the last and most heavy one.
- Remove waiting SVG optimization step.
- Don't render \<source> element if image metadata doesn't emit it.
- Change source of public URL for \<img> element in \<picture>.

## [1.5.1] - 2021-07-28

### Fixed

- Add `width` and `height` attributes to \<img>, by default.
- By default, shortcode will generate `srcset` for _320_, _640_, _960_, _1280_ and _1600_ pixels.

## [1.5.0] - 2021-07-27

### Added

- `lazy` property to `ImageProperties` for allowing third-party libraries lazy load images.
- `srcName` and `srcsetName` properties to `ImageProperties` to be able to customize name of the _src_ and _srcset_ attributes respectively.
- `ImageProperties` can have any valid attribute for \<img> element now.

### Changed

- Set default compression level to 85%.

## [1.4.1] - 2021-07-23

### Fixed

- Caching all parameters of `image` shortcode to be able react on every parameter change.
- source path is passed to `@11ty/eleventy-img` now.

## [1.4.0] - 2021-07-23

### Added

- Add `toHTML` into `ImageProperties` for granular controlling SVG output.

### Changed

- Rename `ImageAttributes` to `ImageProperties`.

## [1.3.0] - 2021-07-22

### Added

- Memoizing repeated images (in-memory).
- Automatic image downloading.
- Ability to generate HTML for GIF.
- Ability to insert SVG into HTML or add it as link in \<img> element.

### Changed

- Handle up to 40 images in parallel.
- By default, for most raster formats plugin generates `jpeg`, `webp` and `avif` images.

## [1.2.0] - 2021-06-03

### Added

- Debug logger in `EleventyShortcodeImage` namespace.
- Images that are downloaded from the Web will have names from `URL.pathname` property.

### Removed

- _output_ directory is not source of truth for SVGs anymore.

### Fixed

- Ability to process remote images.

## [1.1.1] - 2021-05-05

### Changed

- Shortcode writes images with the same relative paths as in source directory (save subdirectories).
- Shortcode does not rename files now.

## [1.1.0] - 2021-04-29

### Added

- `svgoOptions` option for configuration of behavior of [svgo](https://github.com/svg/svgo) package.
- `rasterOptions` option for [@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/) package behavior optimization.

## [1.0.1] - 2021-04-01

### Fixed

- Provide default value for `alt` and `title` attributes if user did not pass them.

## [1.0.0] - 2021-04-01

### Added

- Image transformation and compression.
- SVG optimization.
- Adding or changing classes in SVG.
