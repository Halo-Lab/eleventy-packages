import { isJust } from '@fluss/core';

import { URL_DELIMITER } from '@eleventy-packages/common';

import { CloudflareURLOptions, ImageAttributes } from './index';

export interface BuildCloudflareImageOptions extends ImageAttributes {
	normalizedZone: string;
	fullOptions: CloudflareURLOptions;
	rebasedOriginalURL: string;
	mode: 'img' | 'url' | 'attributes';
}

/** Builds a full image Cloudflare URL. */
const cloudflareURL = (
	zone: string,
	options: CloudflareURLOptions,
	originalURL: string,
) =>
	zone +
	URL_DELIMITER +
	'cdn-cgi' +
	URL_DELIMITER +
	'image' +
	URL_DELIMITER +
	Object.entries(options)
		.map(([name, value]) => (value !== undefined ? `${name}=${value}` : ''))
		.join(',') +
	URL_DELIMITER +
	originalURL;

export const buildCloudflareImage = ({
	normalizedZone,
	fullOptions,
	rebasedOriginalURL,
	attributes = {},
	sizes = [],
	densities = [],
	emit,
	mode = 'img',
}: BuildCloudflareImageOptions):
	| string
	| Record<string, string | number | boolean> => {
	const url = cloudflareURL(normalizedZone, fullOptions, rebasedOriginalURL);

	if (emit === 'url' || (mode === 'url' && !isJust(emit))) {
		return url;
	}

	const srcset =
		sizes.length > 0
			? `srcset="${sizes
					.map(
						(size) =>
							`${cloudflareURL(
								normalizedZone,
								{
									...fullOptions,
									width: size,
								},
								rebasedOriginalURL,
							)} ${size}w`,
					)
					.join(',')}"`
			: densities.length > 0
			? densities
					.map(
						(density) =>
							`${cloudflareURL(
								normalizedZone,
								{ ...fullOptions, width: fullOptions.width! * density },
								rebasedOriginalURL,
							)} ${density}x`,
					)
					.join(',')
			: '';

	if (sizes.length > 0 || densities.length > 0) {
		delete attributes.srcset;
	}

	if (emit === 'attributes' || (mode === 'attributes' && !isJust(emit))) {
		return {
			...attributes,
			src: url,
			srcset,
		};
	}

	const renderedAttributes = Object.entries(attributes)
		.map(([name, value]) =>
			typeof value === 'boolean' ? (value ? name : '') : `name="${value}"`,
		)
		.join(' ');

	return `<img src="${url}" ${srcset} ${renderedAttributes} />`;
};
