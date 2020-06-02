import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

// eslint-disable-next-line no-undef
const production = !process.env.ROLLUP_WATCH;
const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
  }),
  resolve({
    browser: true,
  }),
  commonjs({
    namedExports: {
      '@mapbox/polyline': ['decode'],
    },
  }),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
  }),
  postcss({
    plugins: [require('tailwindcss'), require('autoprefixer')],
    extract: true,
  }),
  production && terser(),
];

export default [
  {
    input: 'route/index.js',
    output: {
      file: 'public/route/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'car/index.js',
    output: {
      file: 'public/car/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'stations/index.js',
    output: {
      file: 'public/stations/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'tile-server/index.js',
    output: {
      file: 'public/tile-server/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
];
