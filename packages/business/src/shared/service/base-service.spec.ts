import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { type IBaseResponse } from '../../api';
import { Paginate } from '../../paginate';

import type { ApiModule } from './types';
import { BaseService } from './base-service';

type MockEntity = {
    id: string;
    name: string;
}

type MockEntityParams = Omit<MockEntity, 'id'>;

const mockApi = jest.mocked<ApiModule<MockEntity, MockEntityParams, MockEntityParams>>({
    getAll: jest.fn() as jest.MockedFunction<ApiModule<MockEntity, MockEntityParams, MockEntityParams>['getAll']>,
    getOne: jest.fn() as jest.MockedFunction<ApiModule<MockEntity, MockEntityParams, MockEntityParams>['getOne']>,
    create: jest.fn() as jest.MockedFunction<ApiModule<MockEntity, MockEntityParams, MockEntityParams>['create']>,
    update: jest.fn() as jest.MockedFunction<ApiModule<MockEntity, MockEntityParams, MockEntityParams>['update']>,
    delete: jest.fn() as jest.MockedFunction<ApiModule<MockEntity, MockEntityParams, MockEntityParams>['delete']>,
});

class MockService extends BaseService<MockEntity, MockEntityParams, MockEntityParams> {
    constructor(api: ApiModule<MockEntity, MockEntityParams, MockEntityParams>) {
        super(api, (response: MockEntity) => response);
    }
}

jest.mock('../../paginate', () => ({
    Paginate: jest.fn().mockImplementation((page, limit, total, results = []) => ({
        page,
        limit,
        total,
        results: Array.isArray(results) ? results : [],
    }))
}));

describe('BaseService', () => {
    let service: MockService;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        service = new MockService(mockApi);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('create', () => {
        it('must successfully create an entity.', async () => {
            const mockEntity: MockEntity = { id: '1', name: 'Test' };
            const mockEntityParams: MockEntityParams = { name: mockEntity.name };
            mockApi.create.mockResolvedValue(mockEntity);

            const result = await service.create(mockEntityParams);

            expect(mockApi.create).toHaveBeenCalledWith(mockEntityParams, undefined);
            expect(result).toEqual(mockEntity);
        });

    });

    describe('update', () => {
        it('must update an entity successfully.', async () => {
            const mockEntity: MockEntity = { id: '1', name: 'Updated Test' };
            const mockEntityParams: MockEntityParams = { name: mockEntity.name };
            mockApi.update.mockResolvedValue(mockEntity);

            const result = await service.update(mockEntity.id, mockEntityParams);

            expect(mockApi.update).toHaveBeenCalledWith(mockEntity.id, mockEntityParams, undefined);
            expect(result).toEqual(mockEntity);
        });

    });

    describe('getAll', () => {
        it('must return all entities in array format.', async () => {
            const mockEntities: MockEntity[] = [
                { id: '1', name: 'Test1' },
                { id: '2', name: 'Test2' },
            ];
            mockApi.getAll.mockResolvedValue(mockEntities);

            const result = await service.getAll({});

            expect(mockApi.getAll).toHaveBeenCalledWith({}, undefined);
            expect(result).toEqual(mockEntities);
        });

        it('must return all entities in paginated format.', async () => {
            const mockPaginateResponse = new (Paginate as any)(1, 10, 1, [
                { id: '1', name: 'Test1' },
                { id: '2', name: 'Test2' },
            ]);
            // Garantir que results está definido corretamente
            mockPaginateResponse.results = [
                { id: '1', name: 'Test1' },
                { id: '2', name: 'Test2' },
            ];

            const queryParams = { limit: 10, page: 1 };
            mockApi.getAll.mockResolvedValue(mockPaginateResponse);

            const result = await service.getAll(queryParams);

            expect(mockApi.getAll).toHaveBeenCalledWith(queryParams, undefined);
            expect(result).toEqual(mockPaginateResponse);
        });

    });

    describe('get', () => {
        it('must return an entity successfully.', async () => {
            const mockEntity: MockEntity = { id: '1', name: 'Test' };
            mockApi.getOne.mockResolvedValue(mockEntity);

            const result = await service.get(mockEntity.id);

            expect(mockApi.getOne).toHaveBeenCalledWith(mockEntity.id, undefined);
            expect(result).toEqual(mockEntity);
        });

    });

    describe('remove', () => {
        it('must successfully remove an entity.', async () => {
            const mockResponse: IBaseResponse = { message: 'Successfully removed' };
            mockApi.delete.mockResolvedValue(mockResponse);

            const result = await service.remove('1');

            expect(mockApi.delete).toHaveBeenCalledWith('1', undefined);
            expect(result).toEqual(mockResponse);
        });

    });

});