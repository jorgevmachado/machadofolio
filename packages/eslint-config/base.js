import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";

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
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'object-curly-spacing': ['error', 'always'],
      'space-before-function-paren': ['error', {
        'named': 'never',
        'anonymous': 'always',
        'asyncArrow': 'always'
      }],
      'sort-imports': ['error', {
        'ignoreCase': false,
        'ignoreMemberSort': false,
        'allowSeparatedGroups': true,
        'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single'],
        'ignoreDeclarationSort': false,
      }],
      'keyword-spacing': ['error', { 'before': true, 'after': true }],
      "turbo/no-undeclared-env-vars": "warn",
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  },
];
