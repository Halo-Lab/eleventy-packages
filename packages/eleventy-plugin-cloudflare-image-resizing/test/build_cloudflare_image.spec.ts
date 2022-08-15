import {
	buildCloudflareImage,
	BuildCloudflareImageOptions,
} from '../src/build_cloudflare_image';

const mockDataCloudflareImageOptions: BuildCloudflareImageOptions = {
	normalizedZone: '',
	fullOptions: {
		anim: true,
		dpr: 1,
		format: 'auto',
		quality: 85,
	},
	rebasedOriginalURL: 'cloudflare-images/car.b62406a0fe1.jpg',
	mode: 'img',
};

describe('buildCloudflareImage', () => {
	it('should return correct image url', () => {
		const result = buildCloudflareImage(mockDataCloudflareImageOptions);

		expect(result).toBe(
			`<img src="/cdn-cgi/image/anim=true,dpr=1,format=auto,quality=85/${mockDataCloudflareImageOptions.rebasedOriginalURL}"   />`,
		);
	});
});
