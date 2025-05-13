import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { NestModuleAbstract } from '../../abstract';

import { Move } from './move';

jest.mock('../../abstract');

describe('Pokemon Move', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
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

    describe('constructor', () => {
        it('should initialize with the correct path and config Pokemon Move', () => {
            expect(move).toBeDefined();
            expect(NestModuleAbstract).toHaveBeenCalledTimes(1);
            expect(NestModuleAbstract).toHaveBeenCalledWith({
                pathUrl: 'pokemon',
                subPathUrl: 'move',
                nestModuleConfig: mockConfig,
            });
        });
    });
});
