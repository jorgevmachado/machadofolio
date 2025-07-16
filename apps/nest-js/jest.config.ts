import { config } from '@repo/jest/nest';

export default {
    ...config,
    setupFilesAfterEnv: [
        ...(config.setupFilesAfterEnv || []),
        require.resolve('./jest.setup.ts')
    ]
};

