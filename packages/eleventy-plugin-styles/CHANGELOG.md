# [1.3.0] - 2021-09-23

### Changed

- By default, `critical` library won't process stylesheets. To enable it provide at least empty object (`{}`) to `criticalOptions` property.

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
