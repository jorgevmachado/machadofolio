import { config as baseConfig } from '@repo/eslint-config/library';

/** @type {import("eslint").Linter.Config} */
export default [
    ...baseConfig,
    {
        languageOptions: {
            parserOptions: {
                project: 'tsconfig.lint.json',
                tsconfigRootDir: process.cwd(),
            },
        },

    }
];
