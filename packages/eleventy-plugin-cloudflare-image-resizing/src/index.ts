import fs from 'fs';
import path from 'path';
import process from 'process';

import { isJust } from '@fluss/core';

import { bold, hash, oops, URL_DELIMITER } from '@eleventy-packages/common';

/**
 * Reference:
 * https://developers.cloudflare.com/images/image-resizing/url-format/
 */
export interface CloudflareURLOptions {
	/** Whether to preserve animation frames from input files. */
	readonly anim?: boolean;
	/** Background color to add underneath the image. */
	readonly background?: string;
	/** Blur radius between 1 (slight blur) and 250 (maximum). */
	readonly blur?: number;
	/** Increase brightness by a decimal factor. */
	readonly brightness?: number;
	/** Increase contrast by a decimal factor. */
	readonly contrast?: number;
	/**
	 * Device Pixel Ratio.
	 * Multiplier for *width/height* that makes it easier to specify
	 * higher-DPI sizes in *<img srcset>*.
	 */
	readonly dpr?: number;
	/** Affects interpretation of *width* and *height*. */
	readonly fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
	/** Defines the preferred image format. */
	readonly format?: 'auto' | 'avif' | 'webp' | 'json';
	/** Increase exposure by a decimal factor. */
	readonly gamma?: number;
	/**
	 * When cropping with `fit: "cover"` and `fit: "crop"`, this parameter
	 * defines the side or point that should not be cropped.
	 */
	readonly gravity?:
		| 'auto'
		| 'left'
		| 'right'
		| 'top'
		| 'bottom'
		| `${number}x${number}`;
	/** Specifies maximum height of the image in pixels. */
	readonly height?: number;
	/** Controls amount of invisible metadata (EXIF data) that should be preserved. */
	readonly metadata?: 'keep' | 'copyright' | 'none';
	/**
	 * In case of a fatal error that prevents the image from being resized,
	 * redirects to the unresized source image URL.
	 */
	readonly onerror?: 'redirect';
	/** Specifies quality for images in JPEG, WebP, and AVIF formats. */
	readonly quality?: number;
	/** Number of degrees (90, 180, or 270) to rotate the image by. */
	readonly rotate?: number;
	/** Specifies strength of sharpening filter to apply to the image. */
	readonly sharpen?: number;
	/** Specifies a number of pixels to cut off on each side. */
	readonly trim?: `${number};${number};${number};${number}`;
	/** Specifies maximum width of the image in pixels. */
	readonly width?: number;
}

const injectDefaultOptions = (
	options: CloudflareURLOptions,
): CloudflareURLOptions => ({
	anim: true,
	dpr: 1,
	format: 'auto',
	quality: 85,
	...options,
});

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
	Object.entries(options)
		.map(([name, value]) => (value !== undefined ? `${name}=${value}` : ''))
		.join(',') +
	URL_DELIMITER +
	originalURL;

export interface InitializeOptions {
	/** Domain name on Cloudflare. */
	readonly zone?: string | URL;
	/**
	 * Tells what kind of output shortcode has to produce.
	 *
	 * - `img` returns the *<img>* tag.
	 * - `url` returns the bare Cloudflare URL.
	 * - `attributes` returns an object with *<img>* attributes.
	 */
	readonly mode?: 'img' | 'url' | 'attributes';
	/** A name of the directory where the images will be written. */
	readonly directory?: string;
}

export interface ImageAttributes {
	/** Overrides the global *mode* option. */
	readonly emit?: 'img' | 'url' | 'attributes';
	/** Defines a path which is used as the base for the *originalURL*. */
	readonly relativeTo?: string;
	/** Defines the needed densities of an image. */
	readonly densities?: readonly number[];
	/** Defines the sizes of an image depending on the viewport width. */
	readonly sizes?: readonly number[];
	/** Native image attributes pairs. */
	readonly attributes?: Record<string, string | number | boolean>;
}

export default ({
	zone = '',
	mode = 'img',
	directory = 'cloudflare-images',
}: InitializeOptions = {}) => {
	const normalizedZone = typeof zone === 'string' ? zone : zone?.origin ?? '';

	return function (
		this: Eleventy.TemplateContext,
		originalURL: string,
		{
			attributes = {},
			sizes = [],
			densities = [],
			relativeTo,
			emit,
			...options
		}: CloudflareURLOptions & ImageAttributes = {},
	): string | Record<string, string | number | boolean> {
		const outputDirectory = this.page.outputPath.split(path.sep)[0];

		const originalURLPath = originalURL.split(URL_DELIMITER).join(path.sep);

		const inputImagePath = path.resolve(
			process.cwd(),
			relativeTo ?? this.page.inputPath,
			originalURLPath,
		);

		const rebasedImageName =
			path.basename(originalURLPath, path.extname(originalURLPath)) +
			`.${hash(inputImagePath)}` +
			path.extname(originalURLPath);

		const outputImagePath = path.resolve(
			process.cwd(),
			outputDirectory,
			directory,
			rebasedImageName,
		);

		if (!fs.existsSync(outputImagePath)) {
			if (fs.existsSync(inputImagePath)) {
				fs.createReadStream(inputImagePath).pipe(
					fs.createWriteStream(outputImagePath),
				);
			} else {
				oops(
					`Cloudflare image plugin: cannot find the ${bold(
						inputImagePath,
					)} image. Skipping copying...`,
				);
			}
		}

		const fullOptions = injectDefaultOptions(options);

		const rebasedOriginalURL = `${directory}${URL_DELIMITER}${rebasedImageName}`;

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
};
