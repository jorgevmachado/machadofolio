import { config as baseConfig } from '@repo/eslint-config/nest';

export default [
    ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: process.cwd(),
      },
    },
  }
]