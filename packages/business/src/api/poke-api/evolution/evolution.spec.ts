jest.mock('@repo/services', () => ({
    Http: jest.fn().mockImplementation(() => ({
        get: jest.fn(),
        post: jest.fn(),
        path: jest.fn(),
        remove: jest.fn(),
    }))
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

import { Evolution } from './evolution';

describe('PokeApi Evolution', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { 'Content-Type': 'application/json' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let evolution: Evolution;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        (Evolution.prototype as any).get = mockGet;
        evolution = new Evolution(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });


    describe('getByOrder', () => {
        it('should call get with correct URL for getByOrder', async () => {
            mockGet.mockResolvedValue({
                chain: {},
                id: 1,
            });

            const order = 1;

            await evolution.getByOrder(order);

            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledWith(`evolution-chain/${order}`);
        });
    });
});
