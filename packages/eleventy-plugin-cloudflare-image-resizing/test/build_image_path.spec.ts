import { basename, dirname, extname, resolve, sep } from 'path';

import { buildImagePath, BuildImagePathOptions } from '../src/build_image_path';

const mockDataImagePathOptions: BuildImagePathOptions = {
	originalURL: 'car.jpg',
	relativeTo: 'src/layouts',
	page: {
		date: new Date(),
		inputPath: './src/index.njk',
		fileSlug: '',
		filePathStem: '/index',
		outputFileExtension: 'html',
		url: '/',
		outputPath: '_site/index.html',
	},
	directory: 'cloudflare-images',
};

describe('buildImagePath', () => {
	it('should return correct image path properties', () => {
		const result = buildImagePath(mockDataImagePathOptions);

		const hash = result.rebasedImageName.split('.')[1];

		const newImageName =
			basename(
				mockDataImagePathOptions.originalURL,
				extname(mockDataImagePathOptions.originalURL),
			) +
			`.${hash}` +
			extname(mockDataImagePathOptions.originalURL);

		expect(result.inputImagePath).toBe(
			resolve(
				mockDataImagePathOptions.relativeTo +
					sep +
					mockDataImagePathOptions.originalURL,
			),
		);
		expect(result.outputImagePath).toBe(
			resolve(
				dirname(mockDataImagePathOptions.page.outputPath) +
					sep +
					mockDataImagePathOptions.directory +
					sep +
					newImageName,
			),
		);
		expect(result.rebasedImageName).toBe(newImageName);
	});
});
