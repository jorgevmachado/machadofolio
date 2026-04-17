import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';
import onlyWarn from 'eslint-plugin-only-warn';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defaultRules } from './default-rules.js';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import('eslint').Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...defaultRules,
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: [
      'dist/**',
      '**/*.spec.{js,jsx,ts,tsx}',
      '**/*.setup.{js,jsx,ts,tsx}',
      '**/*.stories.{js,jsx,ts,tsx}',
    ],
  },
];
