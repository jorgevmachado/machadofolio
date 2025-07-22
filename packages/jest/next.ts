import type { Config } from 'jest';
import nextJest from 'next/jest';
import { config as baseConfig } from './base';

const createJestConfig = nextJest({
    dir: './',
});

const config = {
    ...baseConfig,
    testEnvironment: 'jsdom',
    collectCoverageFrom: [
        ...baseConfig.collectCoverageFrom || [],
        '**/*.{ts,tsx,js,jsx}',
        'packages/**/src/**/*.{js,jsx,ts,tsx}',
        '!**/.next/**',
        '!elements/icon/groups/**',
    ],
    moduleFileExtensions: [...baseConfig.moduleFileExtensions, 'jsx', 'tsx'],
} as const satisfies Config;

export default createJestConfig(config);