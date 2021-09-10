import { sep, dirname } from 'path';

/** Gets _output_ directory name. */
export const getBuildDirectory = (url: string) => {
  const directoryName = dirname(url).split(sep)[0];

  return directoryName === '.' ? '' : directoryName;
};
