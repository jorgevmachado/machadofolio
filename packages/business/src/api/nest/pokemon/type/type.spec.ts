jest.mock('../../abstract', () => {
    class NestModuleAbstract {
        public pathUrl: string;
        public subPathUrl: string;
        public get = jest.fn<(...args: any[]) => Promise<any>>();
        public post = jest.fn<(...args: any[]) => Promise<any>>();
        public path = jest.fn<(...args: any[]) => Promise<any>>();
        public getAll = jest.fn<(...args: any[]) => Promise<any>>();
        constructor(config: any) {
            this.pathUrl = config?.pathUrl;
            this.subPathUrl = config?.subPathUrl;
        }
    }

    return { NestModuleAbstract };
});

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import type { QueryParameters } from '../../../../types';

import { Type } from './type';

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
        it('should call inherited methods from NestModuleAbstract about pokemon type', async () => {
            (type.getAll as any).mockResolvedValue([]);

            const queryParams: QueryParameters = { name: 'test' };
            const result = await type.getAll(queryParams);

            expect(type.getAll).toHaveBeenCalledTimes(1);
            expect(type.getAll).toHaveBeenCalledWith(queryParams);
            expect(result).toEqual([]);
        });
    });
});
