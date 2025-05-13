import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { NestModuleAbstract } from '../../abstract';

import { Ability } from './ability';

jest.mock('../../abstract');

describe('Pokemon Ability', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let ability: Ability;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        ability = new Ability(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should initialize with the correct path and config Pokemon Ability', () => {
            expect(ability).toBeDefined();
            expect(NestModuleAbstract).toHaveBeenCalledTimes(1);
            expect(NestModuleAbstract).toHaveBeenCalledWith({
                pathUrl: 'pokemon',
                subPathUrl: 'ability',
                nestModuleConfig: mockConfig,
            });
        });
    });
});
