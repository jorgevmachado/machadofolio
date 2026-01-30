import { extractLastNumberFromUrl } from '@repo/services';

jest.mock('@repo/services', () => ({
    Http: jest.fn().mockImplementation(() => ({
        get: jest.fn(),
        post: jest.fn(),
        path: jest.fn(),
        remove: jest.fn(),
    })),
    extractLastNumberFromUrl: jest.fn()
}));

const mockGet = jest.fn<(...args: any[]) => Promise<any>>();

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { GrowthRate } from './growthRate';

describe('PokeApi Growth Rate', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { 'Content-Type': 'application/json' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let growthRate: GrowthRate;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        (GrowthRate.prototype as any).get = mockGet;
        (extractLastNumberFromUrl as jest.Mock).mockReturnValue(1);
        growthRate = new GrowthRate(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });


    describe('getByOrder', () => {
        it('should call get with correct order for getByOrder', async () => {
            mockGet.mockResolvedValue({
                chain: {},
                id: 1,
            });

            const order = 1;

            await growthRate.getByOrder(order);

            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledWith(`growth-rate/${order}`);
        });
    });
});
