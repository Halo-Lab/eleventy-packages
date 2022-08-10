const path = require('path');

/**
 * Extracts extension name from url.
 * By default, it is without leading point character.
 * @param {string} url
 * @param {boolean} [withDot]
 */
module.exports.extensionOf = (url, withDot = false) =>
	withDot ? path.extname(url) : path.extname(url).slice(1);
