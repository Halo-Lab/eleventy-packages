const path = require('path');

const { SOURCE_DIRECTORY, BUILD_DIRECTORY } = require('../constants');

/**
 * Start resolving file or directory in source directory of
 * current working directory.
 *
 * @param {ReadonlyArray<string>} parts
 */
const reachFromSource = (...parts) => path.resolve(SOURCE_DIRECTORY, ...parts);

/**
 * Start resolving file or directory in build directory of
 * current working directory.
 *
 * @param {ReadonlyArray<string>} parts
 */
const reachFromBuild = (...parts) => path.resolve(BUILD_DIRECTORY, ...parts);

module.exports = {
  reachFromBuild,
  reachFromSource,
};
