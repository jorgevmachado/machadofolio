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
    collectCoverageFrom: [
        '**/*.(t|j)s',
        '!**/node_modules/**',
        '!**/dist/**',
        '!**/.next/**',
        '!index.ts',
        '!**/*.{enum,types,interface}.ts',
        '!**/path/to/excluded/files/**'
    ],
    resetMocks: true,
    restoreMocks: true,
    clearMocks: true,
    setupFilesAfterEnv: [require.resolve('./jest.setup.ts')],
} as const satisfies Config;