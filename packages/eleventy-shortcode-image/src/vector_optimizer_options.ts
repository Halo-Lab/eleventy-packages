import { AdditionalOptions } from './types';
import { OptimizeOptions, PresetDefault } from 'svgo';

const overrideDefaultPlugins = (
  options: OptimizeOptions & AdditionalOptions,
): PresetDefault => ({
  name: 'preset-default',
  params: {
    overrides: {
      removeViewBox: {
        remove: options.shouldDeleteViewBox ?? false,
      },
    },
  },
});

/** Build options for SVG optimizer. */
export const getVectorOptimizerOptions = (
  input: string,
  classNames: ReadonlyArray<string>,
  options: OptimizeOptions & AdditionalOptions = {},
): OptimizeOptions => ({
  path: input,
  plugins: [
    overrideDefaultPlugins(options),
    // Remove width and height attributes from <svg>
    {
      name: 'removeDimensions',
      active: options.shouldDeleteDimensions ?? true,
    },
    // Add name of SVG to id for create unique IDs if many SVGs will be present in page
    {
      name: 'prefixIds',
      active: true,
    },
    {
      name: 'addClassesToSVGElement',
      active: classNames.length > 0,
      params: {
        classNames,
        // We need this hack in order to get rid of TS error.
        // In svgo typings "addClassesToSVGElement" plugin
        // hasn't got params property.
      } as never,
    },
  ],
  ...options,
});
