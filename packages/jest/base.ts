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
    setupFiles: [require.resolve('./jest.setup-globals.ts')],
    setupFilesAfterEnv: [require.resolve('./jest.setup.ts')],
    collectCoverageFrom: [
        '**/*.{ts,js}',
        '!src/**/*.d.ts',
        '!**/*.stories.tsx',
        '!**/node_modules/**',
        '!**/dist/**',
        '!index.ts',
        '!**/*.{enum,types,interface}.ts',
        '!**/path/to/excluded/files/**',
        '!**/mock/**',
        '!**/mocks/**',
        '!**/*.mock.ts',
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
        'options.ts',
        'styles.ts',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/e2e/',
        '<rootDir>/test/',
    ]
} as const satisfies Config;