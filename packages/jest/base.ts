import type {Config} from 'jest';

export const config = {
    collectCoverage: true,
    testEnvironment: 'jsdom',
    coverageProvider: 'v8',
    coverageDirectory: 'coverage',
    moduleFileExtensions: ['js', 'ts', 'json'],
    coveragePathIgnorePatterns: [
        'node_modules',
        'dist',
        '.next',
        'index.ts',
        'main.ts',
        'enum.ts',
        'interface.ts',
        'types.ts',
    ],
} as const satisfies Config;