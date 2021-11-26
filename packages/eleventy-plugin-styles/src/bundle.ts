import { writeFile } from 'fs/promises';

import { tap } from '@fluss/core';
import {
  not,
  rip,
  mkdir,
  Linker,
  FileEntity,
  LinkerResult,
  isRemoteLink,
} from '@eleventy-packages/common';

import { STYLESHEET_LINK_REGEXP } from './constants';
import { getCompiler, GetCompilerOptions } from './compile';
import { normalize, NormalizeStepOptions } from './normalize';

export const createFileBundler = ({
  file,
  options,
}: LinkerResult<
  Omit<NormalizeStepOptions, 'url' | 'css' | 'html'> & GetCompilerOptions
>) => {
  const compile = getCompiler({
    sassOptions: options.sassOptions,
    lessOptions: options.lessOptions,
  });

  return async (html: string): Promise<FileEntity> => {
    const css = await compile(file.sourcePath);
    const result = await normalize({
      ...options,
      css,
      url: file.sourcePath,
      html,
    });

    return {
      ...file,
      data: result.css,
    };
  };
};

export const writeStyleFile = tap(async (entity: FileEntity) => {
  await mkdir(entity.outputPath);
  await writeFile(entity.outputPath, entity.data, { encoding: 'utf8' });
});

export const createPublicUrlInjector =
  ({ originalUrl, publicUrl }: FileEntity) =>
  (html: string): string =>
    html.replace(originalUrl, publicUrl);

export const findStyles = (html: string) =>
  rip(html, STYLESHEET_LINK_REGEXP, not(isRemoteLink));

export const bindLinkerWithStyles =
  <Options>(linker: Linker<Options>) =>
  (links: readonly string[]): readonly LinkerResult<Options>[] =>
    links.map((link) =>
      linker(link, (link) => link.replace(/(sa|sc|le)ss$/, 'css')),
    );
