import path from 'path';

import { tryExecute } from '@fluss/core';

import { URL_DELIMITER } from './constants';

/** Checks if text is URL. */
export const isUrl = (text: string) =>
	tryExecute(
		// If text is not URL then error will be thrown.
		// https://developer.mozilla.org/en-US/docs/Web/API/URL
		() => new URL(text),
	)
		.map(() => true)
		.extract(() => false);

/**
 * Converts a URL to filesystem path.
 * It gets path part of the URL and match it
 * to the filesystem path.
 */
export const urlToPath = (url: string) => (prefix: string) =>
	path.join(
		prefix,
		new URL(url).pathname.slice(1).split(URL_DELIMITER).join(path.sep),
	);

/** Prepends leading slash if url doesn't have it.  */
export const withLeadingSlash = (url: string) =>
	url.startsWith(URL_DELIMITER) ? url : URL_DELIMITER + url;

/** Delete last slash if url have it.  */
export const trimLastSlash = (url: string) =>
	url.endsWith(URL_DELIMITER) ? url.slice(0, -1) : url;

/** Predicate that detects remote URLs.  */
export const isRemoteLink = (value: string): boolean => /^https?/.test(value);

/** Checks if an url is absolute. */
export const isAbsoluteURL = (url: string) => url.startsWith(URL_DELIMITER);

/** Checks if an url is from Public Internet. */
export const isPublicInternetURL = (url: string) =>
	url.startsWith('http') || url.startsWith('https');
