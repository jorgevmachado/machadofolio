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
        ...baseConfig.coveragePathIgnorePatterns,
        'app.data-source.ts',
        '.module.ts',
        '.guards.ts',
        '.entity.ts',
        '.dto.ts',
        '.mock.ts',
    ]
} as const satisfies Config;