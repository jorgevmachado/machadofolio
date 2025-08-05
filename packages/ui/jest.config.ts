import { config } from '@repo/jest/react-library';

export default {
    ...config,
    setupFiles: [
        ...(config.setupFiles || []),
        require.resolve('./jest.setup.ts')
    ],
    setupFilesAfterEnv: [
        ...(config.setupFilesAfterEnv || []),
        require.resolve('./jest.setup.ts')
    ],
    moduleNameMapper: {
        '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.ts',
        '^@repo/ds/(.*)$': '<rootDir>/../ds/$1',
        ...(config.moduleNameMapper || {})
    }
};
