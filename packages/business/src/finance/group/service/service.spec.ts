import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { type Nest } from '../../../api';

import { GROUP_MOCK } from '../../mock';

import { GroupService } from './service';

jest.mock('../../../api');

describe('Group Service', () => {
    let service: GroupService;
    let mockNest: jest.Mocked<Nest>;
    const mockEntity = GROUP_MOCK;
    const mockPaginateParams = { page: 1, limit: 10 };
    const mockEntityList = [mockEntity, mockEntity];
    const mockEntityPaginate = {
        skip: 0,
        next: 0,
        prev: 0,
        total: 0,
        pages: 0,
        results: mockEntityList,
        per_page: 0,
        current_page: 0,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockNest = {
            finance: {
                group: {
                    getAll: jest.fn(),
                    getOne: jest.fn(),
                    create: jest.fn(),
                    update: jest.fn(),
                    delete: jest.fn(),
                },
            },
        } as unknown as jest.Mocked<Nest>;

        service = new GroupService(mockNest);
    });

    afterEach(() => {
        jest.resetModules();
    });


    describe('create', () => {
        it('should successfully create an group', async () => {
            mockNest.finance.group.create.mockResolvedValue(mockEntity);

            const result = await service.create({ name: mockEntity.name, finance: mockEntity.finance });

            expect(mockNest.finance.group.create).toHaveBeenCalledWith({
                name: mockEntity.name,
                finance: mockEntity.finance
            }, undefined);
            expect(result.id).toEqual(mockEntity.id);
            expect(result.name).toEqual(mockEntity.name);
            expect(result.name_code).toEqual(mockEntity.name_code);
            expect(result.finance.id).toEqual(mockEntity.finance.id);
        });
    });

    describe('update', () => {
        it('should successfully update an group', async () => {
            mockNest.finance.group.update.mockResolvedValue(mockEntity);

            const result = await service.update(mockEntity.id, {
                name: mockEntity.name,
                finance: mockEntity.finance
            });

            expect(mockNest.finance.group.update).toHaveBeenCalledWith(
                mockEntity.id,
                {
                    name: mockEntity.name,
                    finance: mockEntity.finance
                },
                undefined
            );
            expect(result.id).toEqual(mockEntity.id);
            expect(result.name).toEqual(mockEntity.name);
            expect(result.name_code).toEqual(mockEntity.name_code);
            expect(result.finance.id).toEqual(mockEntity.finance.id);
        });

        it('should throw an error if the update fails', async () => {
            const mockError = new Error('Failed to update group');
            mockNest.finance.group.update.mockRejectedValue(mockError);

            await expect(
                service.update(mockEntity.id, { name: mockEntity.name, finance: mockEntity.finance }),
            ).rejects.toThrow('Failed to update group');
        });

        it('should call the update method with correct arguments', async () => {
            mockNest.finance.group.update.mockResolvedValue(mockEntity);

            await service.update(mockEntity.id, { name: mockEntity.name, finance: mockEntity.finance });

            expect(mockNest.finance.group.update).toHaveBeenCalledWith(
                mockEntity.id,
                {
                    name: mockEntity.name,
                    finance: mockEntity.finance
                },
                undefined
            );
            expect(mockNest.finance.group.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('delete', () => {
        it('should successfully delete an group', async () => {
            const mockResponse = { message: 'Successfully removed' };
            mockNest.finance.group.delete.mockResolvedValue(mockResponse);
            const result = await service.remove(mockEntity.id);

            expect(mockNest.finance.group.delete).toHaveBeenCalledWith(
                mockEntity.id,
                undefined
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('should successfully get an group', async () => {
            mockNest.finance.group.getOne.mockResolvedValue(mockEntity);
            const result = await service.get(mockEntity.id);

            expect(mockNest.finance.group.getOne).toHaveBeenCalledWith(
                mockEntity.id,
                undefined
            );
            expect(result.id).toEqual(mockEntity.id);
            expect(result.name).toEqual(mockEntity.name);
            expect(result.name_code).toEqual(mockEntity.name_code);
            expect(result.finance.id).toEqual(mockEntity.finance.id);
        });
    });

    describe('getAll', () => {
        it('should successfully getAll group list', async () => {
            mockNest.finance.group.getAll.mockResolvedValue(mockEntityList);
            const result = await service.getAll({});

            expect(mockNest.finance.group.getAll).toHaveBeenCalledWith({}, undefined);
            expect(result).toEqual(mockEntityList);
        });

        it('should successfully getAll group list paginate', async () => {
            mockNest.finance.group.getAll.mockResolvedValue(
                mockEntityPaginate,
            );
            const result = await service.getAll(mockPaginateParams);

            expect(mockNest.finance.group.getAll).toHaveBeenCalledWith(
                mockPaginateParams,
                undefined
            );
            expect(result).toEqual(mockEntityPaginate);
        });
    });
});