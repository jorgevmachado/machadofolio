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

import { Move } from './move';

describe('PokeApi Move', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { 'Content-Type': 'application/json' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let move: Move;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        (Move.prototype as any).get = mockGet;
        move = new Move(mockConfig);
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

            await move.getByOrder(order);

            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledWith(`move/${order}`);
        });
    });
});
