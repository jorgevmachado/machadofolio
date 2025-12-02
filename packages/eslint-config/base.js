import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
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
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2, { 'SwitchCase': 1 }],
      'object-curly-spacing': ['error', 'always'],
      'space-before-function-paren': ['error', {
        'named': 'never',
        'anonymous': 'always',
        'asyncArrow': 'always'
      }],
      'simple-import-sort/imports': ['error', {
        groups: [
          // 1. React imports
          ['^react$', '^react(\\/.*)?$', '^@?react(-dom)?'],
          // 2. Third-party libraries (ex: next, lodash, etc)
          ['^[a-zA-Z]'],
          // 3. Pacotes internos específicos
          ['^@repo/services$'],
          ['^@repo/business$'],
          ['^@repo/ds$'],
          ['^@repo/ui$'],
          // 4. Outros pacotes internos do monorepo
          ['^@repo/'],
          // 5. Imports relativos: ../../
          ['^\\.\\./\\.\\./'],
          // 6. Imports relativos: ../
          ['^\\.\\./'],
          // 7. Imports relativos: ./
          ['^\\./'],
          // 8. Side effects
          ['^\\u0000'],
        ],
      }],
      'simple-import-sort/exports': 'error',
      'sort-imports': 'off',
      'keyword-spacing': ['error', { 'before': true, 'after': true }],
      "turbo/no-undeclared-env-vars": "warn",
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      }],
        'function-paren-newline': ['error', 'consistent'],
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: [
        "dist/**",
      '**/*.spec.{js,jsx,ts,tsx}',
      '**/*.setup.{js,jsx,ts,tsx}',
      '**/*.stories.{js,jsx,ts,tsx}'
    ],
  },
];
