import fs from 'fs';
import https from 'https';

import { mkdir } from '@eleventy-packages/common';
import { when } from '@fluss/core';

import { Source, SourceUrl } from './path_converter';

/** Downloads image and returns absolute path to it. */
const download = async (url: string, to: string): Promise<void> =>
	new Promise((resolve, reject) =>
		https.get(url, (res) => {
			const fileStream = fs.createWriteStream(to);

			res.pipe(fileStream);

			// We don't need to close the _fileStream_ manually because
			// `autoClose` option in `fs.createWriteStream` is set to
			// `true`, by default.
			// [See options here](https://nodejs.org/dist/latest-v14.x/docs/api/fs.html#fs_fs_createwritestream_path_options)
			fileStream.on('error', reject).on('finish', resolve);
		}),
	);

/** Downloads image if it's not exist. */
export const fetchImage = when(
	(source: Source): source is SourceUrl =>
		source.isURL && !fs.existsSync(source.sourcePath),
)(
	async (source: Source) => {
		// Because we have checked in predicate that source is URL,
		// so we can safely type source parameter as SourceUrl.
		await mkdir(source.sourceDir);

		await download((source as SourceUrl).sourceUrl, source.sourcePath);
	},
	() => Promise.resolve(),
);
