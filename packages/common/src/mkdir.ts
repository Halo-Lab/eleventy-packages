import { extname, dirname } from 'path';
import { promises, existsSync } from 'fs';

import { identity, pipe, when } from '@fluss/core';

import { resolve } from './promise';

/** Checks if a path points to a directory. */
export const isDirectory = (path: string): boolean => extname(path) === '';

export const mkdir = pipe(
	when(isDirectory)(identity, dirname),
	when((path: string) => existsSync(path))(resolve, (directory: string) =>
		promises.mkdir(directory, { recursive: true }),
	),
);
