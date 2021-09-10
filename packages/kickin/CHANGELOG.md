# [0.4.0] - 2021-05-06

### Added

- Filtering `styles` and `scripts` variables in templates.
- Handling absolute urls in styles.
- `serve` and `certs` commands.
- Adjusting proper extensions to generated ones from CSS.

### Fixed

- If user define current folder as `.`, then message to move to `.` folder will not be showed.
- Undefined variable error while processing urls in styles.

## [0.3.1] - 2021-04-19

### Changed

- Return back generation of sitemap, because of its necessity.

## [0.3.0] - 2021-04-19

### Added

- Automatic generation of `.env` file.

### Changed

- Package is bundled as a bunch of ES modules (They are stable up from NodeJS **v12**).
- _sitemap.xml_ is generated only in _production_ environment by default.

## [0.2.0] - 2021-04-16

### Added

- Automatic installing `peerDependencies` for npm version `6` and below - [#1](https://github.com/Halo-Lab/kickin/issues/1).
- Example of `.env` file in _standard_ template.
- Progress bar and percentage to display current progress - [#2](https://github.com/Halo-Lab/kickin/issues/2).
- Package name near the progress bar, that is currently in installation process.
- Add hint about switching to generated project [#2](https://github.com/Halo-Lab/kickin/issues/2).

## [0.1.0] - 2021-04-15

### Added

- Ability to initialize Eleventy project with custom configuration.
