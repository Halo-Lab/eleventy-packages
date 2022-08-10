import { join } from 'path';

import { generateSW } from 'workbox-build';
import { GenerateSWConfig } from 'workbox-build/generate-sw';
import {
	bold,
	done,
	oops,
	start,
	isProduction,
	URL_DELIMITER,
	definePluginName,
} from '@eleventy-packages/common';

import { toMegabytes } from './to_megabytes';
import { joinUrlParts } from './url';
import { getBuildDirectory } from './path_stats';
import { makeManifestURlsAbsolute } from './transform_entries';
import { buildSWScriptRegistration } from './injectable_script';
import { EXTENSIONS, STATIC_FORMATS } from './constants';

definePluginName('Workbox');

export interface EleventyPluginWorkboxOptions {
	/**
	 * Options that will be passed to
	 * [`generateSW` function](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW).
	 */
	generateSWOptions?: GenerateSWConfig;
	/**
	 * Directory inside _output_ folder to be used as place for
	 * service worker.
	 */
	publicDirectory?: string;
	/**
	 * Scope for service worker.
	 */
	scope?: string;
	/**
	 * Tells if plugin should generate service worker.
	 * Useful for situations when there is a need to test service worker,
	 * especially in development process.
	 *
	 * By default it is enabled if `NODE_ENV === 'production'`.
	 */
	enabled?: boolean;
}

/**
 * Generate service worker for caching project's files.
 * In _build_ directory will be generated one file for this.
 * Script for registering generated service worker will be
 * automatically included into HTML.
 *
 * Note that if you set listeners to `afterBuild` event
 * in your Eleventy build pipeline, then this plugin should
 * be the last one.
 */
export const cache = (
	/** Eleventy config object. */
	config: Record<string, Function>,
	{
		scope = URL_DELIMITER,
		enabled = isProduction(),
		publicDirectory = '',
		generateSWOptions,
	}: EleventyPluginWorkboxOptions = {},
) => {
	if (enabled) {
		const serviceWorkerPublicUrl = joinUrlParts(
			publicDirectory,
			'service-worker.js',
		);

		// Holds name of output directory.
		let outputDirectory: string;

		config.addTransform(
			'service-worker',
			function (
				this: { outputPath: string },
				content: string,
				outputPath: string,
			) {
				outputDirectory ??= getBuildDirectory(this.outputPath ?? outputPath);

				if (outputPath.endsWith('html')) {
					const htmlWithServiceWorker = content.replace(
						'</head>',
						buildSWScriptRegistration(serviceWorkerPublicUrl, scope) +
							'</head>',
					);

					done(
						`Service worker registration script is injected into "${bold(
							this.outputPath ?? outputPath,
						)}"`,
					);

					return htmlWithServiceWorker;
				}

				return content;
			},
		);

		config.on('afterBuild', () =>
			Promise.resolve(start('Generation of service worker has started.'))
				.then(() =>
					generateSW({
						cacheId: 'EleventyPluginWorkbox',
						swDest: join(outputDirectory, serviceWorkerPublicUrl),
						sourcemap: !isProduction(),
						skipWaiting: true,
						globPatterns: [`*.{${EXTENSIONS}}`, `**/*.{${EXTENSIONS}}`],
						clientsClaim: true,
						directoryIndex: 'index.html',
						globDirectory: outputDirectory,
						inlineWorkboxRuntime: true,
						cleanupOutdatedCaches: true,
						runtimeCaching: [
							{
								handler: 'NetworkFirst',
								urlPattern: ({ url }: { url: string }) =>
									!new RegExp(
										`.+\\.(?:${[
											'jpg',
											'png',
											'gif',
											'ico',
											'svg',
											'jpeg',
											'avif',
											'webp',
											'eot',
											'ttf',
											'otf',
											'ttc',
											'woff',
											'woff2',
										].join('|')})`,
									).test(url),
							},
							{
								handler: 'StaleWhileRevalidate',
								urlPattern: new RegExp(`.+\\.(?:${STATIC_FORMATS.join('|')})$`),
							},
						],
						manifestTransforms: [makeManifestURlsAbsolute],
						...(generateSWOptions ?? {}),
					}),
				)
				.then(
					({ size, count }) =>
						done(
							`${bold(count)} files will be precached, totaling ${bold(
								toMegabytes(size),
							)} MB.`,
						),
					oops,
				),
		);
	}
};
