import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { type IQueryParameters } from '../../types';

import { type INestModuleConfig } from '../types';

import { NestModuleAbstract } from './nestModuleAbstract';

type MockEntity = {
    id: string;
    name: string;
}

type MockEntityParams = Omit<MockEntity, 'id'>;

const mockGet = jest.fn<(...args: any[]) => Promise<any>>();
const mockPost = jest.fn<(...args: any[]) => Promise<any>>();
const mockPath = jest.fn<(...args: any[]) => Promise<any>>();
const mockRemove = jest.fn<(...args: any[]) => Promise<any>>();

class MockModule extends NestModuleAbstract<
    MockEntity,
    MockEntityParams,
    MockEntityParams
> {
    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'mock-path', nestModuleConfig });
        (this.get as any) = mockGet;
        (this.post as any) = mockPost;
        (this.path as any) = mockPath;
        (this.remove as any) = mockRemove;
    }
}

class MockModuleSubPath extends NestModuleAbstract<
    MockEntity,
    MockEntityParams,
    MockEntityParams
> {
    constructor(nestModuleConfig: INestModuleConfig) {
        super({
            pathUrl: 'mock-path',
            subPathUrl: 'mock-sub-path',
            nestModuleConfig,
        });
        (this.get as any) = mockGet;
        (this.post as any) = mockPost;
        (this.path as any) = mockPath;
        (this.remove as any) = mockRemove;
    }
}

describe('NestModuleAbstract', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig: INestModuleConfig = {
        baseUrl: mockBaseUrl,
        headers: mockHeaders,
    };

    let mockModule: MockModule;
    let mockModuleSubPath: MockModuleSubPath;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockGet.mockReset();
        mockPost.mockReset();
        mockPath.mockReset();
        mockRemove.mockReset();
        mockModule = new MockModule(mockConfig);
        mockModuleSubPath = new MockModuleSubPath(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('getAll', () => {
        it('should call get with correct URL and parameters for getAll', async () => {
            mockGet.mockResolvedValue(new (require('../../../paginate').Paginate)(1, 10, 1, [{ id: '1', name: 'Example' }]));
            const queryParams = { search: 'test', page: 1 };
            const result = await mockModule.getAll(queryParams);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledWith('mock-path', { params: queryParams });
            expect(result).toBeInstanceOf(require('../../../paginate').Paginate);
        });

        it('should call get with correct URL for getAll with by and without parameters', async () => {
            mockGet.mockResolvedValue([{ id: '1', name: 'Example' }]);
            const queryParams: IQueryParameters = { all: true };
            const result = await mockModule.getAll(queryParams, 'by');
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledWith('mock-path/by', { params: queryParams });
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('getOne', () => {
        it('should call get with correct URL for getOne', async () => {
            mockGet.mockResolvedValue({ id: '1', name: 'Example' });
            const mockId = '1';
            const result = await mockModule.getOne(mockId);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledWith('mock-path/1');
            expect(result).toEqual({ id: '1', name: 'Example' });
        });

        it('should call get with correct URL for getOne with subPath', async () => {
            mockGet.mockResolvedValue({ id: '1', name: 'Example' });
            const mockId = '1';
            const result = await mockModuleSubPath.getOne(mockId);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledWith('mock-path/1/mock-sub-path');
            expect(result).toEqual({ id: '1', name: 'Example' });
        });
    });

    describe('delete', () => {
        it('should call remove with correct URL for delete', async () => {
            mockRemove.mockResolvedValue({ success: true });
            const mockId = '1';
            const result = await mockModule.delete(mockId);
            expect(mockRemove).toHaveBeenCalledTimes(1);
            expect(mockRemove).toHaveBeenCalledWith('mock-path/1');
            expect(result).toEqual({ success: true });
        });
    });

    describe('create', () => {
        it('should call post with correct URL and body for create', async () => {
            mockPost.mockResolvedValue({ success: true });
            const mockBody = { id: '1', name: 'New Entity' };
            const result = await mockModule.create(mockBody);
            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockPost).toHaveBeenCalledWith('mock-path', { body: mockBody });
            expect(result).toEqual({ success: true });
        });

        it('should call post with correct URL and body for create with subPath', async () => {
            mockPost.mockResolvedValue({ success: true });
            const mockBody = { id: '1', name: 'New Entity' };
            const result = await mockModuleSubPath.create(mockBody);
            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockPost).toHaveBeenCalledWith('mock-path/mock-sub-path', { body: mockBody });
            expect(result).toEqual({ success: true });
        });
    });

    describe('update', () => {
        it('should call path with correct URL and body for update', async () => {
            mockPath.mockResolvedValue({ success: true });
            const mockId = '1';
            const mockBody = { name: 'Updated Entity' };
            const result = await mockModule.update(mockId, mockBody);
            expect(mockPath).toHaveBeenCalledTimes(1);
            expect(mockPath).toHaveBeenCalledWith('mock-path/1', { body: mockBody });
            expect(result).toEqual({ success: true });
        });
    });
});