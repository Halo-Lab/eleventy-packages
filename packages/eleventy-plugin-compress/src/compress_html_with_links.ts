import { join, dirname } from 'path';

import { done, oops, start, mkdir } from '@eleventy-packages/common';

import { rip } from './rip';
import { read } from './read';
import { gzip } from './gzip';
import { write } from './write';
import { brotli } from './brotli';
import { deflate } from './deflate';
import { isRelative } from './is_relative';
import { CompressAlgorithm } from './types';
import { SCRIPTS_LINK_REGEXP, STYLESHEET_LINK_REGEXP } from './constants';

const COMPRESSOR_FUNCTIONS = {
	gzip,
	brotli,
	deflate,
} as const;

/**
 * Perform compression of HTML file, styles
 * and scripts that are referenced by this HTML.
 */
export const compressHTMLWithLinks = async (
	content: string,
	outputPath: string,
	algorithm: CompressAlgorithm | ReadonlyArray<CompressAlgorithm>,
	buildDirectory: string,
) => {
	const normalizeAlgorithms =
		typeof algorithm === 'string' ? [algorithm] : algorithm;

	const contents = [Promise.resolve({ data: content, url: outputPath })]
		.concat(
			rip(content, STYLESHEET_LINK_REGEXP).map((link) =>
				read(
					join(isRelative(link) ? dirname(outputPath) : buildDirectory, link),
				),
			),
		)
		.concat(
			rip(content, SCRIPTS_LINK_REGEXP).map((link) =>
				read(
					join(isRelative(link) ? dirname(outputPath) : buildDirectory, link),
				),
			),
		);

	await Promise.all(
		normalizeAlgorithms.map((compressAlgorithmName) => {
			const compressor = COMPRESSOR_FUNCTIONS[compressAlgorithmName];

			return Promise.all(
				contents.map((info) =>
					info.then(({ data, url }) => {
						start(`Start to compress "${url}" file`);

						mkdir(url)
							.then(() => compressor(data, url))
							.then(write)
							.then(
								() =>
									done(
										`"${url}" file was successfully compressed and written to disk`,
									),
								oops,
							);
					}),
				),
			);
		}),
	);
};
