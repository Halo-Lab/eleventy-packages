## [1.5.4] - 2023-01-30

### Changed

- Changed the style compilation functionality. Now style files are created relative to the style path and without a hash in the name.

### Fixed

- Resolved the issue of deleting old style files.

### Added

- Added query hash to style URL.

## [1.4.4] - 2021-08-17

### Fixed

- Resolved the path issue for non-English characters.

### Added

- Added testing for plugin functionality.

## [1.4.2 - 1.4.3] - 2022-08-10

### Fixed

- Resolved the issue with folder/file path creation (also fixed for Windows). Closed issue [#9](https://github.com/Halo-Lab/eleventy-packages/issues/9).

## [1.4.1] - 2021-12-24

### Fixed

- rebuilding a stylesheet when some dependencies were changed.

## [1.4.0] - 2021-11-24

### Added

- handling [less](https://lesscss.org) files (by default is disabled in favour of [sass](https://sass-lang.com)).
- abilily to turn off PostCSS plugins with 'off' value (thanks to [lwojcik](https://github.com/lwojcik)).
- ability to disable preprocessors in favour of plain CSS.
- generating hash to the stylesheet names.

### Fixed

- handling the single quote in Stylesheet URLs (thanks to [lwojcik](https://github.com/lwojcik)).
- rebuild only those stylesheets that are changed (during development).

## [1.3.2] - 2021-09-24

### Fixed

- Skip remote stylesheets from processing.

## [1.3.0] - 2021-09-23

### Changed

- By default, `critical` library won't process stylesheets. To enable it provide at least empty object (`{}`) to `criticalOptions` property.

### Fixed

- Links of the outer stylesheets won't be touched.

## [1.2.0] - 2021-08-09

### Added

- Ability to inline critical styles into HTML and defer uncritical styles.
- Add `critical` to _peerDependencies_.

### Fixed

- Use `/` as separator symbol in URL instead of system separator.

## [1.1.1] - 2021-07-24

### Changed

- Logger output slightly prettier text now.

### Fixed

- Repeated recompilation of styles if file is referenced in two or more different templates.
- Style recompiliation on every change that wasn't made in stylesheets.

## [1.1.0] - 2021-05-21

### Added

- Ability to write relative urls of styles.

## [1.0.2] - 2021-04-29

### Changed

- `cssnano` bumped to 5th version.

## [1.0.1] - 2021-04-29

### Changed

- User-defined plugins preceed PurgeCSS, autoprefixer and cssnano plugins now.

### Fix

- Showing message that URLs of styles were inserted into HTML, while there weren't any.
- Color of time is now black (is some terminals it was white by default with yellow background).

## [1.0.0] - 2021-04-07

### Added

- Processing styles accessed by links from HTML, its compilation, normalization and minification.
