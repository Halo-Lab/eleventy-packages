/**
 * Get format/formats of image.
 *
 * Due to poor browser supports of `avif` and `tiff` images,
 * these formats are not included in output format and by
 * default they will be converted to supported formats.
 *
 * Formats that are accepted by plugin: https://www.11ty.dev/docs/plugins/image/
 */
export const getImageFormatsFrom = (
  extension: string
): ReadonlyArray<string> => {
  switch (extension) {
    case 'png':
      return ['png', 'webp', 'avif'];
    case 'jpg':
    case 'jpeg':
    case 'webp':
    case 'avif':
    case 'tiff':
      return ['jpeg', 'webp', 'avif'];
    default:
      return [extension];
  }
};

export const isGif = (path: string): boolean => path.endsWith('gif');

export const isSVG = (path: string): boolean => path.endsWith('svg');
