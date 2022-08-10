import { withLeadingSlash } from '@eleventy-packages/common';

/**
 * Builds link tag of manifest file to be
 * inserted into HTML.
 */
export const buildManifestLinkTag = (url: string) =>
	/* html */ `<link rel="manifest" href="${withLeadingSlash(
		url,
	)}" crossorigin="use-credentials" />`;
