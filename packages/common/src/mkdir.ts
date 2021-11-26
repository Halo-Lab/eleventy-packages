import { extname, dirname } from 'path';
import { promises, existsSync, PathLike } from 'fs';

import { identity, pipe, when } from '@fluss/core';

import { unit } from './unit';
import { resolve } from './promise';

/** Checks if a path points to a directory. */
export const isDirectory = (path: string): boolean => extname(path) === '';

export const mkdir = pipe(
  when(isDirectory)(identity, dirname),
  when(existsSync)(
    pipe(resolve, unit),
    pipe(
      (directory: PathLike) => promises.mkdir(directory, { recursive: true }),
      unit,
    ),
  ),
);
