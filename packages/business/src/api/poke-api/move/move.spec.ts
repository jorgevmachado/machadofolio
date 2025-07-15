import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { Http } from '@repo/services';

import { Move } from './move';

jest.mock('@repo/services');

describe('PokeApi Move', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { 'Content-Type': 'application/json' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let move: Move;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        move = new Move(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });


    describe('getByOrder', () => {
        it('should call get with correct URL for getByOrder', async () => {
            const mockedGet = jest.spyOn(Http.prototype, 'get').mockResolvedValue({
                chain: {},
                id: 1,
            });

            const order = 1;

            await move.getByOrder(order);

            expect(mockedGet).toHaveBeenCalledTimes(1);
            expect(mockedGet).toHaveBeenCalledWith(`move/${order}`);
        });
    });
});
