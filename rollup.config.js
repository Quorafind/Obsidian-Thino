import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import less from '@rollup/plugin-less';

const isProd = process.env.BUILD === 'production';

export default {
  input: 'src/index.ts',
  output: {
    format: 'cjs',
    file: 'main.js',
    exports: 'default',
    sourcemap: 'inline',
    sourcemapExcludeSources: isProd,
  },
  external: ['obsidian', 'fs', 'os', 'path'],
  sourceMap: true,
  plugins: [
    less(),
    typescript(),
    resolve({
      browser: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    babel({
      presets: ['@babel/preset-react', '@babel/preset-typescript'],
    }),
    commonjs(),
  ],
};
