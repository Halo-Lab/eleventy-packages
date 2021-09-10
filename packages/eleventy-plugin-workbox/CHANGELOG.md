# [1.4.0] - 2021-06-07

### Added

- Ability to define [scope for service worker](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register).

### Fixed

- _urlPattern_ in `StaleWhileRevalidate` strategy.

## [1.3.0] - 2021-05-24

### Changed

- By default, all URLs are precached by workbox as absolute now.

## [1.2.2] - 2021-05-24

### Change

- Value of 1 megabyte in bytes according to International System of Units recommendation.

### Fixed

- Creating public path of service worker from root of site.
- Creating public url for service worker manifest on Windows may use `\` as separator.

### Removed

- Deprecated `serviceWorkerDirectory` and `buildDirectory` properties of plugin options.

## [1.2.1] - 2021-04-30

### Added

- Message of starting service worker generation.

### Changed

- Decreased version of `workbox-build` peer dependency.

### Fixed

- Fix color of time in terminal's output on yellow background.

## [1.2.0] - 2021-04-26

### Changed

- Deprecate `buildDirectory` option.
- Deprecate `serviceWorkerDirectory` option and add `publicDirectory` option in favour of it.

## [1.1.1] - 2021-04-01

### Added

- [TypeScript's definition files](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html).

### Changed

- Time log from custom format to default locale based one.

## [1.1.0] - 2021-03-31

This release has not any changes. The reason of it is [unpublished version of package with such name had made two years ago](https://registry.npmjs.org/eleventy-plugin-workbox). [NPM does not allow to republish package with same version](https://docs.npmjs.com/cli/v7/commands/npm-unpublish#description) so we just rewrite release version.

## [1.0.0] - 2021-03-30

### Added

- Automatic injection of service worker registration in HTML.
- Generation of service worker based on built assets by Eleventy.
