const path = require('path');
const { writeFile } = require('fs').promises;

const makeDirectories = require('./mkdir');
const { reachFromBuild } = require('./reach');

/**
 * Write compiled content to output directory.
 * Returns public path of compiled content (under build directory).
 *
 * @param {string} content
 * @param {ReadonlyArray<string>} parts - path to content's file.
 */
module.exports = async (content, ...parts) => {
  const outputFilePath = reachFromBuild(...parts);

  return makeDirectories(path.dirname(outputFilePath))
    .then(() => writeFile(outputFilePath, content))
    .then(() => path.join(...parts));
};
