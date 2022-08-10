// @ts-ignore
import * as critical from 'critical';

import { URL_DELIMITER } from '@eleventy-packages/common';

/** Object that is passed to rebase function in critical package. */
export interface Asset {
	readonly url: string;
	readonly hash: string;
	readonly search: string;
	readonly pathname: string;
	readonly relativePath: string;
	readonly absolutePath: string;
}

export interface CriticalOptions {
	readonly css?: ReadonlyArray<string>;
	readonly src?: string;
	readonly user?: string;
	readonly pass?: string;
	readonly base?: string;
	readonly html?: string;
	readonly width?: number;
	readonly height?: number;
	readonly inline?: boolean | object;
	readonly target?: string | object;
	readonly strict?: boolean;
	readonly rebase?: object | ((asset: Asset) => string);
	readonly ignore?: ReadonlyArray<object>;
	readonly request?: object;
	readonly extract?: boolean;
	readonly userAgent?: string;
	readonly penthouse?: object;
	readonly assetPaths?: ReadonlyArray<string>;
	readonly dimensions?: ReadonlyArray<{ width: number; height: number }>;
	readonly inlineImages?: boolean;
	readonly maxImageFileSize?: number;
}

export interface CriticalResult {
	readonly css: string;
	readonly html: string;
	readonly uncritical: string;
}

interface CriticalCreatorOptions {
	readonly html: string;
	readonly buildDirectory: string;
	readonly criticalOptions: CriticalOptions;
}

export const separateCriticalCSS = ({
	html,
	buildDirectory,
	criticalOptions,
}: CriticalCreatorOptions): Promise<CriticalResult> =>
	critical.generate({
		html,
		base: buildDirectory,
		inline: true,
		extract: true,
		rebase: ({ url, absolutePath }: Asset) =>
			url.startsWith(URL_DELIMITER) ? url : absolutePath,
		penthouse: { timeout: 60000 },
		...criticalOptions,
	});
