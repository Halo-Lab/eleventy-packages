import path from 'path';

import { isGif, isSVG } from './image_formats';
import {
  isUrl,
  urlToPath,
  URL_DELIMITER,
  withLeadingSlash,
} from '@eleventy-packages/common';

interface SourceBase {
  readonly name: string;
  readonly rawInput: string;
  readonly extension: string;
  readonly publicURL: string;
  readonly publicDir: string;
  readonly sourcePath: string;
  readonly sourceDir: string;
  readonly outputPath: string;
  readonly outputDir: string;
  readonly sourcePrefix: string;
  readonly outputPrefix: string;
  readonly relativeOutputDir: string;
  readonly relativeOutputPath: string;

  readonly isSVG: boolean;
  readonly isGIF: boolean;
}

export interface SourceUrl extends SourceBase {
  readonly isURL: true;
  readonly sourceUrl: string;
}

export interface SourcePath extends SourceBase {
  readonly isURL: false;
}

export type Source = SourceUrl | SourcePath;

export const converter = (
  text: string,
  sourcePrefix: string,
  outputPrefix: string,
): Source => {
  const absoluteSourcePrefix = path.resolve(sourcePrefix);
  const absoluteOutputPrefix = path.resolve(outputPrefix);

  const isURL = isUrl(text);

  const addPrefixToPartOfURL = urlToPath(text);

  const sourcePath = isURL
    ? addPrefixToPartOfURL(absoluteSourcePrefix)
    : path.resolve(sourcePrefix, text);
  const outputPath = isURL
    ? addPrefixToPartOfURL(path.resolve(outputPrefix))
    : path.resolve(outputPrefix, text);
  const relativeOutputPath = outputPath.replace(process.cwd(), '.');

  const publicURL = withLeadingSlash(
    outputPath
      .replace(
        absoluteOutputPrefix,
        outputPrefix.split(path.sep).slice(1).join(path.sep),
      )
      .replace(
        new RegExp(path.sep === '\\' ? '\\' + path.sep : path.sep, 'g'),
        URL_DELIMITER,
      ),
  );
  const extension = path.extname(sourcePath).slice(1);

  return {
    sourcePrefix,
    outputPrefix,
    rawInput: text,
    isURL: isURL,
    sourcePath,
    sourceDir: path.dirname(sourcePath),
    // @ts-ignore
    sourceUrl: isURL ? text : undefined,
    outputPath,
    relativeOutputPath,
    relativeOutputDir: path.dirname(relativeOutputPath),
    publicURL,
    publicDir: publicURL.split(URL_DELIMITER).slice(0, -1).join(URL_DELIMITER),
    isGIF: isGif(text),
    isSVG: isSVG(text),
    extension,
    outputDir: path.dirname(outputPath),
    name: path.basename(
      sourcePath.split(path.sep).slice(-1)[0],
      '.' + extension,
    ),
  };
};
