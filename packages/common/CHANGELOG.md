# [0.0.9] - 2022-03-07

### Added

- `mixProperties` function.

### Fixed

- increment internal index of `LimitedMemory` object.

## [0.0.7] - 2021-12-14

### Fixed

- Add encoding to the `flush` function of the manifest handler (fs cache).

## [0.0.6] - 2021-12-13

### Added

- `readFile`, `existsFile`, `removeFile` and `writeFile` functions.
- `readDirectory` and `writeDirectory` functions.
- `queue` data structure.
- `thread` and `limitedMemory` structures.
- memory and FS cache implementation.

## [0.0.5] - 2021-11-24

### Added

- `initMemoryCache` function for initialization memory cache instance.
- `unique` function that creates predicate function that can filter repeated values in arrays and `List`s.
- demethodize static methods from `Promise` class.
- `Linker` that manages file information.
- `isDirectory` checker.

## [0.0.4] - 2021-09-27

### Added

- `not` and `isRemoteLink` functions.

## [0.0.1] - 2021-09-13

### Added

- `last` function that takes last element from an array.
- `makeDirectories` - recursively creates directories for a given path.
- `isProduction` function.
- `unit` function as termination operator in function composition.
- `pretty` module for logging data to console.
- shared constants.
- `isUrl`, `urlToPath` and `toRootUrl` functions.
