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

import { Group } from './group';

describe('Group', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let group: Group;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        group = new Group(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('constructor', () => {
        it('should call inherited methods from NestModuleAbstract about group', async () => {
            (group.getAll as any).mockResolvedValue([]);

            const queryParams: QueryParameters = { name: 'test' };
            const result = await group.getAll(queryParams);

            expect(group.getAll).toHaveBeenCalledTimes(1);
            expect(group.getAll).toHaveBeenCalledWith(queryParams);
            expect(result).toEqual([]);
        });
    });
});