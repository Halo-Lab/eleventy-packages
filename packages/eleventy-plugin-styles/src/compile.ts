import { readFile } from 'fs/promises';
import { resolve as resolvePath, normalize, sep } from 'path';

import { render } from 'less';
import { pipe, tryExecute } from '@fluss/core';
import { compile, Options } from 'sass';
import {
	oops,
	resolve,
	trimLeadingPathDelimiter,
} from '@eleventy-packages/common';

import { PluginState } from './types';

export enum Language {
	CSS = 'css',
	SASS = 'sass',
	LESS = 'less',
}

interface CompilerResult {
	readonly css: string;
	readonly urls: readonly string[];
}

type Compiler = <Options extends object>(
	options: Options,
) => (path: string) => Promise<CompilerResult>;

/**
 * Transform Sass to CSS.
 * It adjusts all Sass files into one CSS file.
 */
const compileSass: Compiler = (options: Options<'sync'>) => async (file) => {
	const { css, loadedUrls } = compile(file, {
		// Allow import styles from installed packages.
		loadPaths: [resolvePath('node_modules')],
		...options,
	});

	return {
		css,
		urls: loadedUrls.map((url) =>
			// decodeURI -> non english letters in path
			trimLeadingPathDelimiter(
				normalize(decodeURI(url.pathname)).replace(process.cwd() + sep, ''),
			),
		),
	};
};

const extractCssFromLessResult = ({
	css,
	imports,
}: Less.RenderOutput): CompilerResult => ({
	css,
	// decodeURI -> non english letters in path
	urls: imports.map((url) =>
		trimLeadingPathDelimiter(
			normalize(decodeURI(url)).replace(process.cwd() + sep, ''),
		),
	),
});

/**
 * Transform Less into CSS.
 * Concats multiple files into one.
 */
const compileLess: Compiler = (options: Less.Options) => (path: string) =>
	tryExecute<Promise<CompilerResult>, Error>(() =>
		pipe(
			(path: string) => readFile(path, { encoding: 'utf8' }),
			pipe((data: string) => render(data, options), extractCssFromLessResult),
		)(path),
	).extract((error) => (oops(error), resolve({ css: '', urls: [] })));

const compileCSS: Compiler = () => (path: string) =>
	readFile(path, { encoding: 'utf8' }).then((css) => ({ css, urls: [] }));

const LanguageHandler = {
	[Language.CSS]: compileCSS,
	[Language.SASS]: compileSass,
	[Language.LESS]: compileLess,
} as const;

export interface GetCompilerOptions {
	readonly lessOptions: Less.Options | PluginState.Off;
	readonly sassOptions: Options<'sync'> | PluginState.Off;
}

export const getCompiler = ({
	sassOptions,
	lessOptions,
}: GetCompilerOptions): ReturnType<Compiler> =>
	sassOptions !== PluginState.Off
		? LanguageHandler[Language.SASS](sassOptions)
		: lessOptions !== PluginState.Off
		? LanguageHandler[Language.LESS](lessOptions)
		: LanguageHandler[Language.CSS]({});
