import { resolve } from 'path';
import { readdir } from 'fs/promises';
import { PathLike } from 'fs';

import { unit } from './unit';
import { File, readFile, writeFile } from './file';

interface DirectoryReader {
	readonly as: (encoding?: BufferEncoding) => DirectoryReader;
	readonly end: () => Promise<readonly File[]>;
	readonly withContent: (value: boolean) => DirectoryReader;
}

export const readDirectory = (path: PathLike): DirectoryReader => {
	let encoding: BufferEncoding | undefined = undefined;
	let shouldIncludeContent = false;

	const reader: DirectoryReader = {
		withContent: (value) => {
			shouldIncludeContent = value;
			return reader;
		},
		as: (type) => {
			encoding = type;
			return reader;
		},
		end: async () => {
			const dirents = await readdir(path, {
				encoding,
				withFileTypes: true,
			});

			const direntsWithContent = dirents.map(async (dirent) =>
				Object.assign(dirent, {
					content: shouldIncludeContent
						? await readFile(resolve(path.toString(), dirent.name))
								.encoding(encoding)
								.content()
						: { name: dirent.name, content: '' },
				}),
			);

			return Promise.allSettled(direntsWithContent).then((results) =>
				results.map((result) =>
					result.status === 'fulfilled' ? result.value : result.reason,
				),
			);
		},
	};

	return reader;
};

export interface DirectoryWriter {
	readonly end: () => Promise<void>;
	readonly file: (file: File) => DirectoryWriter;
	readonly encoding: (value: BufferEncoding) => DirectoryWriter;
}

export const writeDirectory = (path: PathLike) => {
	let encoding: BufferEncoding | undefined = undefined;
	const files: File[] = [];

	const writer: DirectoryWriter = {
		file: (file) => {
			files.push(file);
			return writer;
		},
		encoding: (value) => {
			encoding = value;
			return writer;
		},
		end: () =>
			Promise.all(
				files.map((file) =>
					writeFile(resolve(path.toString(), file.name))
						.encoding(encoding)
						.data(file.content as string | NodeJS.ArrayBufferView),
				),
			).then(unit),
	};

	return writer;
};
