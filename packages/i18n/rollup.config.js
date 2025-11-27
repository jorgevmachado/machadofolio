import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from './package.json' with { type: 'json' };
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
    plugins: [
        resolve(),
        typescript({ tsconfig: './tsconfig.json' }),
        json(),
        commonjs()
    ],
    external: ['i18next', 'react', 'react/jsx-runtime']
};