import postcss from 'rollup-plugin-postcss';

import pkg from './package.json' with { type: 'json' };

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

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
    external: ['react', 'react-dom', '@repo/services', '@repo/business', /jest\.setup(\.ts|\.js)?$/ ],
    plugins: [
        resolve({
                preferBuiltins: true,
            }
        ),
        commonjs(),
        json(),
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: 'dist',
            outDir: 'dist',
            rootDir: 'src'
        }),
        postcss({
            extract: 'index.css',
            modules: false,
            minimize: true,
            extensions: ['.css','.scss'],

        })
    ],
    onwarn(warning, warn) {
        if (
            warning.code === 'CIRCULAR_DEPENDENCY' &&
            (
                (warning.message && warning.message.includes('node_modules')) ||
                (warning.importer && warning.importer.includes('node_modules'))
            )
        ) {
            return;
        }
        warn(warning);
    }
};