import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
    {
        input: 'src/index.ts', // Ajuste se necessário
        output: [
            {
                file: 'dist/index.js',
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
            },
            {
                file: 'dist/index.esm.js',
                format: 'esm',
                sourcemap: true,
            }
        ],
        plugins: [
            nodeResolve({ extensions: ['.js', '.ts'] }),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json', declaration: true, declarationDir: 'dist', outDir: 'dist' })
        ],
        external: [
            "exceljs",
            "uuid"
        ]
    }
];
