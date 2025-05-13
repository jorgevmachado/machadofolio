import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { NestModuleAbstract } from '../../abstract';

import { Type } from './type';

jest.mock('../../abstract');

describe('Pokemon Type', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let type: Type;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        type = new Type(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should initialize with the correct path and config Pokemon Type', () => {
            expect(type).toBeDefined();
            expect(NestModuleAbstract).toHaveBeenCalledTimes(1);
            expect(NestModuleAbstract).toHaveBeenCalledWith({
                pathUrl: 'pokemon',
                subPathUrl: 'type',
                nestModuleConfig: mockConfig,
            });
        });
    });
});
