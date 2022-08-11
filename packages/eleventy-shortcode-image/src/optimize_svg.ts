import { promises } from 'fs';

import { pipe, tryExecute } from '@fluss/core';
import { optimize, OptimizedSvg, OptimizeOptions } from 'svgo';

import { log } from './logger';
import { AdditionalOptions } from './types';
import { getVectorOptimizerOptions } from './vector_optimizer_options';

export const optimizeSVG = (
	filePath: string,
	classNames: ReadonlyArray<string>,
	svgoOptions: OptimizeOptions & AdditionalOptions,
) =>
	tryExecute<Promise<string>, Error>(
		pipe(
			() => promises.readFile(filePath, { encoding: 'utf8' }),
			(data: string) =>
				optimize(
					data,
					getVectorOptimizerOptions(filePath, classNames, svgoOptions),
				),
			({ data }: OptimizedSvg) => data,
		),
	).extract(
		async (error) => (
			log(`SVG optimization is failed with error.\n%O`, error), ''
		),
	);

export const readSVG =
	(classNames: readonly string[]) => (sourcePath: string) =>
		tryExecute<Promise<string>, Error>(() =>
			pipe(
				(sourcePath: string) =>
					promises.readFile(sourcePath, { encoding: 'utf8' }),
				(data: string) =>
					data.replace('<svg', `<svg class="${classNames.join(' ')}"`),
			)(sourcePath),
		).extract(
			async (error: Error) => (
				log(`SVG moving is failed with error.\n%O`, error), ''
			),
		);
