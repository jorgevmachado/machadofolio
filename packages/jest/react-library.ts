import type { Config } from 'jest';
import { config as baseConfig } from './base';

export const config = {
    ...baseConfig,
    rootDir: 'src',
    testRegex: '(test|spec)\.[jt]sx?$',
    transform: {
        '^.+\\.(t|j)sx?$': 'ts-jest',
    },
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@repo/(.*)$': '<rootDir>/packages/$1/src',
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
    coverageDirectory: '../coverage',
    setupFilesAfterEnv: [
        ...baseConfig.setupFilesAfterEnv || [],
        require.resolve('@testing-library/jest-dom'),
    ],
    collectCoverageFrom: [
        ...baseConfig.collectCoverageFrom || [],
        'packages/ds/src/**/*.{js,jsx,ts,tsx}',
        '!elements/icon/groups/**',
        '!**/*.stories.tsx',
        '!src/**/*.d.ts'
    ],
    moduleFileExtensions: [...baseConfig.moduleFileExtensions, 'tsx', 'jsx'],
} as const satisfies Config;