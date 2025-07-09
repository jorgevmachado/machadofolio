import type { Config } from 'jest';

export const config = {
    verbose: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    collectCoverage: false,
    detectOpenHandles: true,
    maxWorkers: "50%",
    coverageProvider: 'v8',
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'lcov', 'text-summary'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    setupFilesAfterEnv: [require.resolve('./jest.setup.ts')],
    collectCoverageFrom: [
        '**/*.(t|j)s',
        '!**/node_modules/**',
        '!**/dist/**',
        '!**/.next/**',
        '!index.ts',
        '!**/*.{enum,types,interface}.ts',
        '!**/path/to/excluded/files/**'
    ],
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