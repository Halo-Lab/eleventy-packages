# [1.1.3] - 2021-06-04

### Fixed

- Bundling `@fluss/core` dependency into output code caused an error, while installing dependency.

## [1.1.2] - 2021-06-04

### Fixed

- Links of icons are rendered with absolute urls now.

## [1.1.1] - 2021-04-30

### Changed

- Decrease version of `pwa-asset-generator` peer dependency.

### Fixed

- Fix color of time in terminal's output on yellow background.

## [1.1.0] - 2021-04-28

### Added

- `enabled` option to control situations when plugin should work.
- `generatorOptions` option to control result of [pwa-asset-generator](https://github.com/onderceylan/pwa-asset-generator).
- `logger` options for debugging purposes.

### Changed

- Deprecated `manifest.outputDirectory` in favour of `manifest.publicDirectory`.
- Deprecated `icons.outputDirectory` in favour of `icons.publicDirectory`.

## [1.0.0] - 2021-04-04

### Added

- Generating PWA splash screens and icons, mstiles and favicons.
- Updating `manifest.json` with metadata of icons.
- Autoupdating every HTML page with links of generated icons.
