export const defaultRules = {
  semi: ['error', 'always'],
  quotes: ['error', 'single'],
  indent: ['error', 2, {'SwitchCase': 1}],
  'object-curly-spacing': ['error', 'always'],
  'space-before-function-paren': [
    'error', {
      'named': 'never',
      'anonymous': 'always',
      'asyncArrow': 'always',
    }],
  'simple-import-sort/imports': [
    'error', {
      groups: [
        ['^react$', '^react(\\/.*)?$', '^@?react(-dom)?'],
        ['^[a-zA-Z]'],
        ['^@repo/services$'],
        ['^@repo/business$'],
        ['^@repo/ds$'],
        ['^@repo/ui$'],
        ['^@repo/'],
        ['^\\.\\./\\.\\./'],
        ['^\\.\\./'],
        ['^\\./'],
        ['^\\u0000'],
      ],
    }],
  'simple-import-sort/exports': 'error',
  'sort-imports': 'off',
  'keyword-spacing': ['error', {'before': true, 'after': true}],
  'turbo/no-undeclared-env-vars': 'warn',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unused-expressions': 'off',
  '@typescript-eslint/consistent-type-imports': [
    'error', {
      prefer: 'type-imports',
      fixStyle: 'inline-type-imports',
    }],
  'function-paren-newline': ['error', 'consistent'],
  'react-hooks/exhaustive-deps': 'off',
}