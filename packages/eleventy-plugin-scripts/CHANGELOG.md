# [1.1.0] - 2021-08-06

### Added

- Code splitting ability though dynamic `import`.

### Changed

- JavaScript is bundled in `ES2018` ECMAScript version and as ES modules, by default.
- Minimal version of `esbuild` is changed to `0.12.0`.

## [1.0.2] - 2021-07-25

### Fixed

- Recompilation of scripts on every change inside project.
- Repeated compilation of the same script if it is referenced from two or more templates.

## [1.0.1] - 2021-04-30

### Changed

- Decrease patch versions of peer dependencies.

### Fixed

- Fix color of time in terminal's output on yellow background.

## [1.0.0] - 2021-04-08

### Added

- Processing scripts accessed as URLs from HTML, its compilation and minification.
