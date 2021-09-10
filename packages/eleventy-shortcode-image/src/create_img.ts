import { last } from 'common';
import { isJust, list } from '@fluss/core';
import { ImageMetadata, Metadata } from '@11ty/eleventy-img';

import { ImageProperties } from './types';

/** Creates \<img> string element. */
export const createImg = (
  attributes: Omit<ImageProperties, 'toHTML'>,
): string =>
  `<img ${Object.entries(attributes)
    .filter(([_, value]) => isJust(value))
    .reduce(
      (all, [name, value]) => all + ' ' + name + '="' + value + '"',
      '',
    )} />`;

const getImageMetadataOf = (
  metadata: Metadata,
  index: number,
): ReadonlyArray<ImageMetadata> => metadata[Object.keys(metadata)[index]];

export const createPicture = (
  metadata: Metadata,
  attributes: Omit<ImageProperties, 'toHTML'>,
  srcName: string,
  srcsetName: string,
): string => {
  // Image of the lowest quality and older format always goes first.
  const lowsrc = last(getImageMetadataOf(metadata, 0));

  return `<picture>
    ${
      list(Object.values(metadata)).chain(list).isEmpty()
        ? ''
        : Object.values(metadata)
            .reverse()
            .map(
              (imageFormat) =>
                `<source type="${
                  imageFormat[0].sourceType ?? ''
                }" ${srcsetName}="${imageFormat
                  .map(({ srcset }) => srcset)
                  .join(', ')}">`,
            )
            .join('\n')
    }
      ${createImg({
        [srcName]: lowsrc.url,
        [srcsetName]: lowsrc.srcset,
        width: lowsrc.width,
        height: lowsrc.height,
        ...attributes,
      })}
    </picture>`;
};
