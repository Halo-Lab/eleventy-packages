import { writeFile } from 'fs/promises';

import { not, awaitedTap } from '@fluss/core';
import {
	rip,
	oops,
	mkdir,
	Linker,
	existsFile,
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
		if (!existsFile(file.sourcePath)) {
			oops(
				`File ${file.sourcePath} not found! \nYou need to create such a file or remove the link from the HTML.`,
			);
		}

		const { css, urls } = await compile(file.sourcePath);

		const result = await normalize({
			...options,
			css,
			url: file.sourcePath,
			html,
		});

		return {
			...file,
			urls,
			data: result.css,
		};
	};
};

export const writeStyleFile = awaitedTap(async (entity: FileEntity) => {
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
