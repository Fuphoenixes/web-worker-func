import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import {uglify} from 'rollup-plugin-uglify'
import rollupTypescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: './src/index.ts',
    output: [
      {
        format: 'cjs',
        file: './dist/index.js',
      },
      {
        format: 'module',
        file: './dist/index.esm.js',
      },
      {
        format: 'umd',
        file: './dist/index.umd.js',
        name: 'webWorkerFuncBuilder'
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      rollupTypescript({
        useTsconfigDeclarationDir: true
      }),
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'usage',
              corejs: 3,
              modules: false
            }
          ],
          '@babel/preset-typescript'
        ],
        plugins: [
          '@babel/plugin-transform-typescript',
          '@babel/plugin-proposal-object-rest-spread'
        ]
      }),
      uglify()
    ]
  },
  {
    input: './src/index.ts',
    output: {
      format: 'esm',
      file: './dist/types/index.d.ts'
    },
    plugins: [
      dts()
    ]
  }
]
