import { sep } from 'path';

import { definePluginName, isProduction } from '@eleventy-packages/common';

import { CompressAlgorithm } from './types';
import { compressHTMLWithLinks } from './compress_html_with_links';

export interface CompressPluginOptions {
	enabled?: boolean;
	algorithm?: CompressAlgorithm | ReadonlyArray<CompressAlgorithm>;
}

definePluginName('Icons');

/** Build directory where Eleventy write templates. */
let buildDirectory: string;

/**
 * Compress content with a specified `algorithm`.
 *
 * At current time available algorithms are:
 *
 *  - [`brotli`](https://brotli.org)
 *  - [`gzip`](http://www.gzip.org)
 *  - [`deflate`](https://en.wikipedia.org/wiki/Deflate)
 *
 * **This plugin should be added last to Eleventy.**
 */
export const compress = (
	config: Record<string, Function>,
	{
		enabled = isProduction(),
		algorithm = 'brotli',
	}: CompressPluginOptions = {},
) => {
	if (enabled) {
		config.addTransform(
			'compress',
			async (content: string, outputPath: string) => {
				if (outputPath.endsWith('html')) {
					// We can safely extract name of the build directory,
					// because it is first directory in _outputPath_.
					buildDirectory ??= outputPath.split(sep)[0];

					await compressHTMLWithLinks(
						content,
						outputPath,
						algorithm,
						buildDirectory,
					);
				}

				return content;
			},
		);
	}
};
