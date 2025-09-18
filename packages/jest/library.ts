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
    moduleNameMapper: {
        '^@repo/(.*)$': [
            '<rootDir>/../../$1/src',
            '<rootDir>/../../$1/dist'
        ],
    },
    coverageDirectory: '../coverage',
    moduleDirectories: ['node_modules', '<rootDir>/../../packages'],
    collectCoverageFrom: [
        ...baseConfig.collectCoverageFrom || [],
        '**/*.{ts,js}',
        'packages/**/src/**/*.{js,ts}',
        '!**/@types/**',
        '!**/mock/**',
    ]
} as const satisfies Config;