import { normalize } from 'path';

import {
	initFsCache,
	isProduction,
	definePluginName,
} from '@eleventy-packages/common';

import { getOutputDirectory } from './get_build_directory';
import { generateAndInsertIcons, PWAIconsOptions } from './transform_html';

definePluginName('PWA icons');

/**
 * Generates splash screens and icons, favicons, mstile images for PWA.
 * Also fills `icons` property in the `manifest.json` file.
 */
export const icons = (
	config: Record<string, Function>,
	{
		logger,
		icons = {},
		manifest = {},
		generatorOptions = {},
		enabled = isProduction(),
	}: PWAIconsOptions = {},
): void => {
	if (enabled) {
		const cacheContainer = initFsCache({ directory: '.icons' });

		config.addTransform(
			'icons',
			async function (
				this: { outputPath: string },
				content: string,
				outputPath: string,
			): Promise<string> {
				const cache = await cacheContainer;

				const outputFilePath = normalize(this.outputPath ?? outputPath);

				return outputFilePath.endsWith('html')
					? generateAndInsertIcons(
							content,
							getOutputDirectory(outputFilePath),
							{
								icons,
								cache,
								logger,
								manifest,
								generatorOptions,
							},
					  )
					: content;
			},
		);
	}
};
