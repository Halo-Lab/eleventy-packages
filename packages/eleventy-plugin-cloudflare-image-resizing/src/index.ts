import fs from 'fs';
import path from 'path';
import { env } from 'process';

import { bold, oops, URL_DELIMITER } from '@eleventy-packages/common';

import { buildImagePath } from './build_image_path';
import { buildCloudflareImage } from './build_cloudflare_image';

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
	/**
	 * A function that checks NODE_ENV for prod or local
	 * prod returns image path from Cloudflare service
	 * local returns image path from local Cloudflare directory
	 */
	readonly bypass?: () => boolean;
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
	/** Domain for image. */
	readonly domain?: string | URL;
}

export default ({
	zone = '',
	mode = 'img',
	directory = 'cloudflare-images',
	bypass = () => env.NODE_ENV !== 'production',
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
			domain = '',
			...options
		}: CloudflareURLOptions & ImageAttributes = {},
	): string | Record<string, string | number | boolean> {
		const normalizedDomain =
			typeof domain === 'string' ? domain : domain?.origin ?? '';

		const fullOptions = injectDefaultOptions(options);

		if (originalURL.startsWith('http') || originalURL.startsWith('https')) {
			return buildCloudflareImage({
				normalizedZone,
				normalizedDomain: '',
				isLocal: bypass(),
				fullOptions,
				rebasedOriginalURL: originalURL,
				attributes,
				sizes,
				densities,
				emit,
				mode,
			});
		}

		const { inputImagePath, outputImagePath, rebasedImageName } =
			buildImagePath({
				originalURL,
				relativeTo,
				page: this.page,
				directory,
			});

		if (!fs.existsSync(outputImagePath)) {
			if (fs.existsSync(inputImagePath)) {
				fs.mkdirSync(path.dirname(outputImagePath), { recursive: true });

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

		const rebasedOriginalURL = `${directory}${URL_DELIMITER}${rebasedImageName}`;

		return buildCloudflareImage({
			normalizedZone,
			normalizedDomain,
			isLocal: bypass(),
			fullOptions,
			rebasedOriginalURL,
			attributes,
			sizes,
			densities,
			emit,
			mode,
		});
	};
};
