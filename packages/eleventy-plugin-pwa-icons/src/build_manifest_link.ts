import { toRootUrl } from '@eleventy-packages/common';

/**
 * Builds link tag of manifest file to be
 * inserted into HTML.
 */
export const buildManifestLinkTag = (url: string) =>
  /* html */ `<link rel="manifest" href="${toRootUrl(
    url,
  )}" crossorigin="use-credentials" />`;
