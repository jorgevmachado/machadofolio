import type { Config } from 'jest';
import { config as baseConfig } from './base';

export const config = {
    ...baseConfig,
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    testEnvironment: 'node',
    coverageDirectory: '../coverage',
    collectCoverageFrom: ['**/*.(t|j)s'],
    coveragePathIgnorePatterns: [
        'index.ts',
        'main.ts',
    ],
} as const satisfies Config;