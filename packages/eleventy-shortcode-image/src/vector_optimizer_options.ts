import { DefaultPlugin, OptimizeOptions } from 'svgo';

/** Build options for SVG optimizer. */
export const getVectorOptimizerOptions = (
  input: string,
  classNames: ReadonlyArray<string>,
  options: OptimizeOptions = {},
): OptimizeOptions => ({
  path: input,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrrides: {
          addClassesToSVGElement: {
            active: classNames.length > 0,
            params: {
              classNames,
            },
          },
        },
        // TS complains that `object` is not assignable to `object | undefined`.
      } as DefaultPlugin<'addClassesToSVGElement', object>['params'],
    },
    // Preserve view-box attribute on <svg> for proper resizing of SVG
    // through CSS.
    {
      name: 'removeViewBox',
      active: false,
    },
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
  ],
  ...options,
});
