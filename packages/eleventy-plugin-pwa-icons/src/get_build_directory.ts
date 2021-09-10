import { sep } from 'path';

/**
 * Eleventy shows output path relative to current working directory,
 * so we can get output directory as first top-level directory.
 */
export const getOutputDirectory = (outputPath: string): string => {
  const firstDirectory = outputPath.split(sep)[0];

  return outputPath.length > 0 &&
    (firstDirectory === '' || firstDirectory.startsWith('.'))
    ? getOutputDirectory(outputPath.split(sep).slice(1).join(sep))
    : firstDirectory;
};
