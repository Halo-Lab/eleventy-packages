import { promises } from 'fs';
import { join, normalize, resolve, sep } from 'path';

import { memoize, pipe, not } from '@fluss/core';
import { build, BuildResult } from 'esbuild';
import {
	rip,
	uid,
	bold,
	done,
	oops,
	start,
	mkdir,
	isRemoteLink,
	isProduction,
	URL_DELIMITER,
	withLeadingSlash,
} from '@eleventy-packages/common';

import { pathStats } from './path_stats';
import { SCRIPTS_LINK_REGEXP } from './constants';
import { ScriptsPluginOptions } from './types';

const { writeFile } = promises;

export type BundleOptions = Required<
	Omit<ScriptsPluginOptions, 'addWatchTarget'>
>;

export interface TransformFileOptions extends BundleOptions {
	readonly buildDirectory: string;
	readonly publicSourcePathToScript: string;
}

export const transformFile = memoize(
	({
		inputDirectory,
		buildDirectory,
		esbuildOptions,
		publicDirectory,
		publicSourcePathToScript,
	}: TransformFileOptions) => {
		start(`Start compiling "${bold(publicSourcePathToScript)}" file.`);

		const pathToScriptFromRoot = join(inputDirectory, publicSourcePathToScript);
		const publicFilePaths = normalize(
			publicSourcePathToScript.replace(/ts$/, 'js'),
		).split(sep);

		return pipe(
			() => resolve(buildDirectory, publicDirectory, publicSourcePathToScript),
			mkdir,
			() =>
				build({
					write: false,
					bundle: true,
					target: 'es2018',
					minify: isProduction(),
					outdir: join(buildDirectory, publicDirectory),
					outbase: inputDirectory,
					format: 'esm',
					splitting: true,
					sourcemap: !isProduction(),
					entryPoints: [pathToScriptFromRoot],
					...esbuildOptions,
				}),
			({ outputFiles = [] }: BuildResult): any =>
				Promise.all(
					outputFiles.map((file) =>
						writeFile(file.path, file.text).then(() => file.path),
					),
				),
			// @ts-ignore // TODO  TS IGNORE
			(paths: string[]) => {
				done(
					`Compiled "${bold(publicSourcePathToScript)}" script${
						paths.length > 1 ? 's were' : 'was'
					} written to "${bold(
						paths
							// We get rid of "map" file.
							.filter((pathPart) => !pathPart.endsWith('.map'))
							.map((pathPart) => pathPart.replace(process.cwd(), ''))
							.join(', '),
					)}"`,
				);
			},

			() =>
				withLeadingSlash(
					[publicDirectory, ...publicFilePaths].join(URL_DELIMITER),
				),
		)();
	},
	({ publicSourcePathToScript }) => publicSourcePathToScript,
);

interface FilePathsMap {
	readonly input: string;
	readonly output: string;
}

const findAndProcessFiles = (
	html: string,
	outputPath: string,
	{ inputDirectory, esbuildOptions, publicDirectory }: BundleOptions,
): Promise<readonly FilePathsMap[]> => {
	const [buildDirectory] = pathStats(outputPath).directories;

	return Promise.all(
		rip(html, SCRIPTS_LINK_REGEXP, not(isRemoteLink)).map((link) =>
			transformFile({
				inputDirectory,
				publicDirectory,
				esbuildOptions,
				buildDirectory,
				publicSourcePathToScript: link,
			}).then((output) => ({
				output,
				input: link,
			})),
		),
	);
};

/** Compile, bundle and minify script. */
export const bundle = async (
	html: string,
	outputPath: string,
	options: BundleOptions,
) =>
	findAndProcessFiles(html, outputPath, options)
		.then((array) => array.filter(Boolean))
		.then(
			(validUrls) => {
				const htmlWithScripts = validUrls.reduce(
					(text, { input, output }) => text.replace(input, `${output}?${uid()}`),
					html,
				);

				if (validUrls.length > 0) {
					done(
						`${validUrls
							.map(({ output }) => `"${bold(output)}"`)
							.join(', ')} URL${
							validUrls.length === 1 ? ' was' : 's were'
						} injected into "${bold(outputPath)}"`,
					);
				}

				return htmlWithScripts;
			},
			(error) => (oops(error), html),
		);
