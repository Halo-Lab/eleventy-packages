import { promisify } from 'util';
import { exec as execute } from 'child_process';

const exec = promisify(execute);

/**
 * Creates executing terminal's commands function
 * for specific working directory.
 */
export const execFor = (cwd: string) => (
  name: string,
  args: ReadonlyArray<string>,
  packageName: string
) => exec(name + ' ' + args.join(' ') + ' ' + packageName, { cwd });
