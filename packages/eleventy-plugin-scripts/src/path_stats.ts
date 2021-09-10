import { dirname, sep } from 'path';

export const pathStats = (url: string) => {
  const directories = dirname(url).split(sep);

  return {
    directories,
  };
};
