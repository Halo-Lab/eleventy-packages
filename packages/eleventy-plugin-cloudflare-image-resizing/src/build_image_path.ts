import path from 'path';
import process from 'process';

import { hash, URL_DELIMITER } from '@eleventy-packages/common';

export interface BuildImagePathOptions {
	originalURL: string;
	relativeTo?: string;
	page: Eleventy.Page;
	directory: string;
}

export interface BuildImagePathResult {
	inputImagePath: string;
	outputImagePath: string;
	rebasedImageName: string;
}

export const buildImagePath = ({
	originalURL,
	relativeTo,
	page,
	directory,
}: BuildImagePathOptions): BuildImagePathResult => {
	const outputDirectory = path.normalize(page.outputPath).split(path.sep)[0];

	const originalURLPath = originalURL.split(URL_DELIMITER).join(path.sep);

	const inputImagePath = path.resolve(
		process.cwd(),
		relativeTo ?? path.dirname(page.inputPath),
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

	return { inputImagePath, outputImagePath, rebasedImageName };
};
