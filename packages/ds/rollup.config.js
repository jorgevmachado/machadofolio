import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import path from 'path';
import pkg from './package.json' with { type: 'json' };
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts', // ajuste conforme seu entry point
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            exports: 'named'
        },
        {
            file: pkg.module || 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true
        }
    ],
    external: ['react', 'react-dom'],
    plugins: [
        resolve(),
        commonjs(),
        json(),
        typescript({ tsconfig: './tsconfig.json' }),
        postcss({
            use: [
                ['sass', { includePaths: [ path.resolve('src'), path.resolve('node_modules') ] }]
            ],
            extract: 'index.css',
            modules: false,
            minimize: true,
            extensions: ['.css','.scss'],

        })
    ]
};
