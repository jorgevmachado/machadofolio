import { config } from '@repo/jest/react-library';

export default {
    ...config,
    setupFilesAfterEnv: [
        ...(config.setupFilesAfterEnv || []),
        require.resolve('./jest.setup.ts')
    ]
};
