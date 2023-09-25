import { URL_DELIMITER } from '@eleventy-packages/common';

import {
	buildCloudflareImage,
	BuildCloudflareImageOptions,
} from '../src/build_cloudflare_image';

const mockDataCloudflare: Record<
	| 'imageOptions'
	| 'imageOptionsWithCloudflareURL'
	| 'imageOptionsWithAttributes'
	| 'imageOptionsDifBypass'
	| 'imageOptionsWithPublicInternetUrl'
	| 'imageOptionsWithPublicInternetUrlDifBypass',
	BuildCloudflareImageOptions
> = {
	imageOptions: {
		normalizedZone: 'https://test.com',
		normalizedDomain: 'https://test.com/',
		isLocal: false,
		fullOptions: {
			anim: true,
			dpr: 1,
			format: 'auto',
			quality: 85,
		},
		rebasedOriginalURL: 'cloudflare-images/car.b62406a0fe1.jpg',
		mode: 'img',
	},
	imageOptionsWithCloudflareURL: {
		normalizedZone: 'https://test.com',
		normalizedDomain: 'https://test.com/',
		isLocal: false,
		fullOptions: {
			anim: true,
			dpr: 1,
			format: 'auto',
			quality: 85,
		},
		rebasedOriginalURL: 'cloudflare-images/car.b62406a0fe1.jpg',
		mode: 'img',
		cloudflareURL: (zone, domain, options, originalURL) =>
			'http://localhost:8787' +
			URL_DELIMITER +
			'?image=' +
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
			(domain ? domain + URL_DELIMITER : '') +
			originalURL,
	},
	imageOptionsWithAttributes: {
		normalizedZone: '',
		normalizedDomain: '',
		isLocal: false,
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
	},
	imageOptionsDifBypass: {
		normalizedZone: 'https://test.com',
		normalizedDomain: 'https://test.com',
		isLocal: true,
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
	},
	imageOptionsWithPublicInternetUrl: {
		normalizedZone: 'https://test.com',
		normalizedDomain: 'https://test.com',
		isLocal: true,
		fullOptions: {
			anim: true,
			dpr: 1,
			format: 'auto',
			quality: 85,
		},
		rebasedOriginalURL: 'https://example.com',
		mode: 'img',
		attributes: {
			alt: 'myImage',
			width: '5',
			toHTML: true,
			disabled: false,
		},
	},
	imageOptionsWithPublicInternetUrlDifBypass: {
		normalizedZone: 'https://test.com',
		normalizedDomain: '',
		isLocal: false,
		fullOptions: {
			anim: true,
			dpr: 1,
			format: 'auto',
			quality: 85,
		},
		rebasedOriginalURL: 'http://example.com',
		mode: 'img',
		attributes: {
			alt: 'myImage',
			width: '5',
			toHTML: true,
			disabled: false,
		},
	},
};

const getQuery = (url: string): string => url.match(/\?([^"]*)/)?.[1] || '';

describe('buildCloudflareImage', () => {
	it('should return correct image url', () => {
		const result = buildCloudflareImage(
			mockDataCloudflare.imageOptions,
		) as string;
		const query = getQuery(result);

		expect(query).toHaveLength(11);
		expect(result).toMatch(
			`<img src="https://test.com/cdn-cgi/image/anim=true,dpr=1,format=auto,quality=85/https://test.com/cloudflare-images/car.b62406a0fe1.jpg?${query}"   />`,
		);
	});

	it('should return correct image url (test with custom cloudflareURL)', () => {
		const result = buildCloudflareImage(
			mockDataCloudflare.imageOptionsWithCloudflareURL,
		);

		expect(result).toBe(
			`<img src="http://localhost:8787/?image=https://test.com/cdn-cgi/image/anim=true,dpr=1,format=auto,quality=85/https://test.com/cloudflare-images/car.b62406a0fe1.jpg"   />`,
		);
	});

	it('should return correct image url (test with attributes)', () => {
		const result = buildCloudflareImage(
			mockDataCloudflare.imageOptionsWithAttributes,
		) as string;
		const query = getQuery(result);

		expect(query).toHaveLength(11);
		expect(result).toMatch(
			`<img src="/cdn-cgi/image/anim=true,dpr=1,format=auto,quality=85/cloudflare-images/car.b62406a0fe1.jpg?${query}"  alt="myImage" width="5" toHTML  />`,
		);
	});

	it('should return correct image url from local directory', () => {
		const result = buildCloudflareImage(
			mockDataCloudflare.imageOptionsDifBypass,
		) as string;
		const query = getQuery(result);

		expect(query).toHaveLength(11);
		expect(result).toBe(
			`<img src="/cloudflare-images/car.b62406a0fe1.jpg?${query}"  alt="myImage" width="5" toHTML  />`,
		);
	});

	it('should return correct image url as public internet url', () => {
		const result = buildCloudflareImage(
			mockDataCloudflare.imageOptionsWithPublicInternetUrl,
		) as string;
		const query = getQuery(result);

		expect(query).toHaveLength(11);
		expect(result).toBe(
			`<img src="https://example.com?${query}"  alt="myImage" width="5" toHTML  />`,
		);
	});

	it('should return correct image url as public internet url from cloudflare service', () => {
		const result = buildCloudflareImage(
			mockDataCloudflare.imageOptionsWithPublicInternetUrlDifBypass,
		) as string;
		const query = getQuery(result);

		expect(query).toHaveLength(11);
		expect(result).toBe(
			`<img src="https://test.com/cdn-cgi/image/anim=true,dpr=1,format=auto,quality=85/http://example.com?${query}"  alt="myImage" width="5" toHTML  />`,
		);
	});
});
