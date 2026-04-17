import path from 'path';
import postcss from 'rollup-plugin-postcss';

import pkg from './package.json' with { type: 'json' };

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';

export default {
    input: 'src/index.ts',
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
    external: ['react', 'react-dom', '@repo/services', /react-icons(\/.*)?/],
    plugins: [
        resolve(),
        commonjs(),
        json(),
        url({
            include: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.gif'],
            limit: 8192,
            emitFiles: true
        }),
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