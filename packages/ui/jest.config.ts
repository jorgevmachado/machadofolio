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
    ]
};
