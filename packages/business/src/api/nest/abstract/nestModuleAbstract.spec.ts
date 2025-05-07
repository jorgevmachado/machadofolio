import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { Paginate } from '../../../paginate';

import { type IQueryParameters } from '../../types';

import { type INestModuleConfig } from '../types';

import { NestModuleAbstract } from './nestModuleAbstract';



jest.mock('@repo/services/http/http');

type MockEntity = {
    id: string;
    name: string;
}

type MockEntityParams = Omit<MockEntity, 'id'>;

class MockModule extends NestModuleAbstract<
    MockEntity,
    MockEntityParams,
    MockEntityParams
> {
    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'mock-path', nestModuleConfig });
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
        mockModule = new MockModule(mockConfig);
        mockModuleSubPath = new MockModuleSubPath(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('getAll', () => {
        it('should call get with correct URL and parameters for getAll', async () => {
            const mockedGet = jest
                .spyOn(mockModule, 'get')
                .mockResolvedValue(
                    new Paginate<MockEntity>(
                        1,
                        10,
                        1,
                        [{ id: '1', name: 'Example' }],
                    ),
                );

            const queryParams = { search: 'test', page: 1 };
            const result = await mockModule.getAll(queryParams);

            expect(mockedGet).toHaveBeenCalledTimes(1);
            expect(mockedGet).toHaveBeenCalledWith('mock-path', {
                params: queryParams,
            });
            expect(result).toBeInstanceOf(Paginate);
        });

        it('should call get with correct URL for getAll with by and without parameters', async () => {
            const mockedGet = jest
                .spyOn(mockModule, 'get')
                .mockResolvedValue([{ id: '1', name: 'Example' }]);

            const queryParams: IQueryParameters = { all: true };
            const result = await mockModule.getAll(queryParams, 'by');

            expect(mockedGet).toHaveBeenCalledTimes(1);
            expect(mockedGet).toHaveBeenCalledWith('mock-path/by', {
                params: queryParams,
            });
            expect(result).toBeInstanceOf(Array);
        });
    });

    describe('getOne', () => {
        it('should call get with correct URL for getOne', async () => {
            const mockedGet = jest
                .spyOn(mockModule, 'get')
                .mockResolvedValue({ id: '1', name: 'Example' });

            const mockId = '1';
            const result = await mockModule.getOne(mockId);

            expect(mockedGet).toHaveBeenCalledTimes(1);
            expect(mockedGet).toHaveBeenCalledWith('mock-path/1');
            expect(result).toEqual({ id: '1', name: 'Example' });
        });

        it('should call get with correct URL for getOne with subPath', async () => {
            const mockedGet = jest
                .spyOn(mockModuleSubPath, 'get')
                .mockResolvedValue({ id: '1', name: 'Example' });

            const mockId = '1';
            const result = await mockModuleSubPath.getOne(mockId);

            expect(mockedGet).toHaveBeenCalledTimes(1);
            expect(mockedGet).toHaveBeenCalledWith('mock-path/1/mock-sub-path');
            expect(result).toEqual({ id: '1', name: 'Example' });
        });
    });

    describe('delete', () => {
        it('should call remove with correct URL for delete', async () => {
            const mockedRemove = jest
                .spyOn(mockModule, 'remove')
                .mockResolvedValue({ success: true });

            const mockId = '1';
            const result = await mockModule.delete(mockId);

            expect(mockedRemove).toHaveBeenCalledTimes(1);
            expect(mockedRemove).toHaveBeenCalledWith('mock-path/1');
            expect(result).toEqual({ success: true });
        });
    });

    describe('create', () => {
        it('should call post with correct URL and body for create', async () => {
            const mockedPost = jest
                .spyOn(mockModule, 'post')
                .mockResolvedValue({ success: true });

            const mockBody = { id: '1', name: 'New Entity' };
            const result = await mockModule.create(mockBody);

            expect(mockedPost).toHaveBeenCalledTimes(1);
            expect(mockedPost).toHaveBeenCalledWith('mock-path', { body: mockBody });
            expect(result).toEqual({ success: true });
        });

        it('should call post with correct URL and body for create with subPath', async () => {
            const mockedPost = jest
                .spyOn(mockModuleSubPath, 'post')
                .mockResolvedValue({ success: true });

            const mockBody = { id: '1', name: 'New Entity' };
            const result = await mockModuleSubPath.create(mockBody);

            expect(mockedPost).toHaveBeenCalledTimes(1);
            expect(mockedPost).toHaveBeenCalledWith('mock-path/mock-sub-path', {
                body: mockBody,
            });
            expect(result).toEqual({ success: true });
        });
    });

    describe('update', () => {
        it('should call path with correct URL and body for update', async () => {
            const mockedPath = jest
                .spyOn(mockModule, 'path')
                .mockResolvedValue({ success: true });

            const mockId = '1';
            const mockBody = { name: 'Updated Entity' };
            const result = await mockModule.update(mockId, mockBody);

            expect(mockedPath).toHaveBeenCalledTimes(1);
            expect(mockedPath).toHaveBeenCalledWith('mock-path/1', { body: mockBody });
            expect(result).toEqual({ success: true });
        });
    });
});