import ora from 'ora';
import chalk from 'chalk';
import { sequentially } from '@fluss/core';

import { execFor } from './exec_for';

const progressBarWithPercentage = (count: number, current: number): string =>
  `[ ${new Array(current).fill('=').join('')}${new Array(count - current)
    .fill(' ')
    .join('')} ] ${Math.floor((current / count) * 100)}%`;

/**
 * Draw progress bar and name of the package that is
 * currently on installation process.
 */
export const progress = async (
  cwd: string,
  packages: ReadonlyArray<string>,
  spinner: ora.Ora
): Promise<void> =>
  sequentially(
    ...packages.map((packageName, index) => async () => {
      spinner.prefixText = progressBarWithPercentage(
        packages.length,
        index + 1
      );
      spinner.text = `Installing dependency: ${chalk.bold(packageName)}`;

      return execFor(cwd)(
        'npm',
        ['i', '-D'],
        packageName
      ).catch((error: Error) => () => console.error(error.toString()));
    })
  )().then(() => void (spinner.prefixText = ''));
