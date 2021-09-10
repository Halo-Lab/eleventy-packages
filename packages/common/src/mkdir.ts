import { promises, existsSync } from 'fs';

/** Recursively creates directories. */
export const makeDirectories = async (path: string): Promise<void> =>
  void (existsSync(path) || (await promises.mkdir(path, { recursive: true })));
