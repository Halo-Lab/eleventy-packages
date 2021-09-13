import { OptimizeOptions, PresetDefault } from 'svgo';

const overrideDefaultPlugins = (): PresetDefault => ({
  name: 'preset-default',
  params: {
    overrides: {
      // Preserve view-box attribute on <svg> for proper resizing of SVG
      // through CSS.
      removeViewBox: false,
    },
  },
});

/** Build options for SVG optimizer. */
export const getVectorOptimizerOptions = (
  input: string,
  classNames: ReadonlyArray<string>,
  options: OptimizeOptions = {},
): OptimizeOptions => ({
  path: input,
  plugins: [
    overrideDefaultPlugins(),
    // Remove width and height attributes from <svg>
    {
      name: 'removeDimensions',
      active: true,
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
