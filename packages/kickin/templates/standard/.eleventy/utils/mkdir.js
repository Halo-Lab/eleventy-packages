const { existsSync, promises } = require('fs');

/**
 * Recursively creates directories if they are not
 * exists.
 * @param {string} directoryPath
 * @returns {Promise<void>}
 */
module.exports = async (directoryPath) =>
  void (
    existsSync(directoryPath) ||
    (await promises.mkdir(directoryPath, { recursive: true }))
  );
