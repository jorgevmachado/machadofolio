import { config } from '@repo/jest/nest';

export default {
    ...config,
    bail: true,
    setupFilesAfterEnv: [
        ...(config.setupFilesAfterEnv || []),
        require.resolve('./jest.setup.ts')
    ]
};

