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
        '^@repo/(.*)$': [
            '<rootDir>/../../$1/src',
            '<rootDir>/../../$1/dist'
        ],
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
    coverageDirectory: '../coverage',
    moduleDirectories: ['node_modules', '<rootDir>/../../packages'],
    setupFilesAfterEnv: [
        ...baseConfig.setupFilesAfterEnv || [],
        require.resolve('@testing-library/jest-dom'),
    ],
    collectCoverageFrom: [
        ...baseConfig.collectCoverageFrom || [],
        '**/*.{ts,tsx,js,jsx}',
        'packages/**/src/**/*.{js,jsx,ts,tsx}',
        '!**/.next/**',
        '!elements/icon/groups/**',
    ],
    moduleFileExtensions: [...baseConfig.moduleFileExtensions, 'tsx', 'jsx'],
} as const satisfies Config;