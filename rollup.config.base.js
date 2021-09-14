import sucrase from '@rollup/plugin-sucrase';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    file: 'build/index.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript'],
    }),
    commonjs(),
    nodeResolve({
      extensions: ['.js', '.ts'],
      resolveOnly: [/@fluss\/core/, '@eleventy-packages/common'],
      moduleDirectories: ['node_modules', 'packages'],
    }),
    terser(),
  ],
};
