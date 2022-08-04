import { rm } from 'fs/promises';
import { Readable } from 'stream';
import { join, resolve } from 'path';

import { isJust, List, None, Option, Some } from '@fluss/core';

import { oops } from '../pretty';
import { mkdir } from '../mkdir';
import { Cache } from './cache';
import { thread } from '../thread';
import { existsFile, readFile, writeFile } from '../file';

interface ManifestEntry {
	readonly name: string;
	readonly pathToContent: string;
}

interface ManifestHandler {
	readonly put: (key: string, item: ManifestEntry) => Promise<void>;
	readonly get: (key: string) => Option<ManifestEntry>;
	readonly keys: () => List<string>;
	readonly flush: () => Promise<void>;
	readonly remove: (key: string) => Promise<void>;
	readonly entries: () => List<[string, ManifestEntry]>;
}

const createManifestHandler = async (
	directory: string,
): Promise<ManifestHandler> => {
	const filePath = resolve(directory, 'cache_manifest.json');

	const data: Record<string, ManifestEntry> = {};

	const flush = () =>
		writeFile(filePath).encoding('utf8').data(JSON.stringify(data));

	if (existsFile(filePath)) {
		await readFile(filePath)
			.encoding('utf8')
			.content()
			.then(JSON.parse)
			.then((content) => Object.assign(data, content))
			.catch(oops);
	} else {
		await flush();
	}

	return {
		entries: () => List(Object.entries(data)),
		get: (key) => (isJust(data[key]) ? Some(data[key]) : None),
		put: async (key, item) => {
			data[key] = item;
			await flush();
		},
		remove: async (key) => {
			delete data[key];
			await flush();
		},
		flush,
		keys: () => List(Object.keys(data)),
	};
};

export interface FsCache
	extends Cache<
		string,
		ManifestEntry & {
			content?: string | Readable;
		}
	> {
	// overridden
	readonly put: (
		key: string,
		value: Omit<ManifestEntry, 'pathToContent'> & {
			readonly content?: string | Readable;
		},
	) => void;
	readonly location: () => string;
}

export interface FsCacheOptions {
	readonly directory?: string;
}

const getValueFrom = (
	manifest: ManifestHandler,
	key: string | RegExp,
): Option<ManifestEntry> =>
	typeof key === 'string'
		? manifest.get(key)
		: manifest
				.keys()
				.find((item) => key.test(item))
				.chain(manifest.get);

export const initFsCache = async ({
	directory = '.fsCache',
}: FsCacheOptions = {}): Promise<FsCache> => {
	const cacheThread = thread();

	const base = resolve(directory);

	await mkdir(base);

	const manifestHandler = await createManifestHandler(base);

	return {
		put: (key, { name, content }) => {
			const relativeFilePath = join(directory, key);

			cacheThread.push(
				manifestHandler.put(key, {
					name,
					pathToContent: relativeFilePath,
				}),
			);

			if (typeof content === 'string') {
				cacheThread.push(
					writeFile(resolve(relativeFilePath)).encoding('utf8').data(content),
				);
			} else if (content !== undefined) {
				cacheThread.push(
					new Promise((res, reject) =>
						content
							.pipe(writeFile(resolve(relativeFilePath)).start())
							.on('end', res)
							.on('error', reject),
					),
				);
			}
		},
		get: (key) => getValueFrom(manifestHandler, key),
		has: (key) => getValueFrom(manifestHandler, key).isSome(),
		remove: (key) =>
			void manifestHandler
				.entries()
				.find(([itemKey]) =>
					typeof key === 'string' ? itemKey === key : key.test(itemKey),
				)
				.map(([itemKey]) =>
					cacheThread.push(
						Promise.all([
							manifestHandler.remove(itemKey),
							rm(resolve(directory, itemKey)),
						]),
					),
				),
		keys: () => manifestHandler.keys(),
		clear: () =>
			manifestHandler
				.keys()
				.forEach((key) =>
					cacheThread.push(
						Promise.all([
							rm(resolve(directory, key)),
							manifestHandler.remove(key),
						]),
					),
				),
		through: (key, or) => getValueFrom(manifestHandler, key).extract(or),
		isEmpty: () => manifestHandler.keys().isEmpty(),
		entries: manifestHandler.entries,
		location: () => directory,
	};
};
