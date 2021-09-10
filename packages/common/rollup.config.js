import sucrase from '@rollup/plugin-sucrase';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'build',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
  plugins: [
    nodeResolve({ extensions: ['.js', '.ts'] }),
    sucrase({
      exclude: ['node_modules'],
      transforms: ['typescript'],
    }),
  ],
  external: ['@fluss/core', 'chalk'],
};
