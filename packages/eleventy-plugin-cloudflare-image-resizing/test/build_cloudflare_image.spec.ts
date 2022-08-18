import {
	buildCloudflareImage,
	BuildCloudflareImageOptions,
} from '../src/build_cloudflare_image';

const mockDataCloudflareImageOptions: BuildCloudflareImageOptions = {
	normalizedZone: 'https://test.com',
	normalizedDomain: 'https://test.com/',
	fullOptions: {
		anim: true,
		dpr: 1,
		format: 'auto',
		quality: 85,
	},
	rebasedOriginalURL: 'cloudflare-images/car.b62406a0fe1.jpg',
	mode: 'img',
};

const mockDataCloudflareImageOptionsWithAttributes: BuildCloudflareImageOptions =
	{
		normalizedZone: '',
		normalizedDomain: '',
		fullOptions: {
			anim: true,
			dpr: 1,
			format: 'auto',
			quality: 85,
		},
		rebasedOriginalURL: 'cloudflare-images/car.b62406a0fe1.jpg',
		mode: 'img',
		attributes: {
			alt: 'myImage',
			width: '5',
			toHTML: true,
			disabled: false,
		},
	};

describe('buildCloudflareImage', () => {
	it('should return correct image url', () => {
		const result = buildCloudflareImage(mockDataCloudflareImageOptions);

		expect(result).toBe(
			`<img src="https://test.com/cdn-cgi/image/anim=true,dpr=1,format=auto,quality=85/https://test.com/cloudflare-images/car.b62406a0fe1.jpg"   />`,
		);
	});

	it('should return correct image url (test with attributes)', () => {
		const result = buildCloudflareImage(
			mockDataCloudflareImageOptionsWithAttributes,
		);

		expect(result).toBe(
			`<img src="/cdn-cgi/image/anim=true,dpr=1,format=auto,quality=85/cloudflare-images/car.b62406a0fe1.jpg"  alt="myImage" width="5" toHTML  />`,
		);
	});
});
