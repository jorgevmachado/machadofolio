import { config } from '@repo/jest/library';

export default {
    ...config,
    rootDir: '.',
    moduleNameMapper: {
        '^@repo/services$': '<rootDir>/../services/dist/index.js',
        '^@repo/services/(.*)$': '<rootDir>/../services/dist/$1'
    },
    transform: {
        '^.+\\.(t|j)s$': [
            'ts-jest',
            { tsconfig: '<rootDir>/tsconfig.spec.json' }
        ],
    },
};
