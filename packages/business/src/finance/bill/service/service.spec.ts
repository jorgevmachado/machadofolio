import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { EBillType, type Nest } from '../../../api';

import { BILL_MOCK } from '../mock';

import { BillService } from './service';

jest.mock('../../../api');

describe('Bill Service', () => {
    let service: BillService;
    let mockNest: jest.Mocked<Nest>;
    const mockEntity = BILL_MOCK;

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

    const params = {
        type: EBillType.BANK_SLIP,
        bank: mockEntity.bank,
        category: mockEntity.category,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockNest = {
            finance: {
                bill: {
                    create: jest.fn(),
                    getAll: jest.fn(),
                    update: jest.fn(),
                },
            },
        } as unknown as jest.Mocked<Nest>;

        service = new BillService(mockNest);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('create', () => {
        it('should successfully create an bill', async () => {
            mockNest.finance.bill.create.mockResolvedValue(mockEntity);

            const result = await service.create(params);

            expect(mockNest.finance.bill.create).toHaveBeenCalledWith(params, undefined);
            expect(result).toEqual(mockEntity);
        });
    });

    describe('update', () => {
        it('should successfully update an bill', async () => {
            mockNest.finance.bill.update.mockResolvedValue(mockEntity);

            const result = await service.update(mockEntity.id, params);

            expect(mockNest.finance.bill.update).toHaveBeenCalledWith(mockEntity.id, params, undefined);
            expect(result).toEqual(mockEntity);
        });

        it('should throw an error if the update bill fails', async () => {
            const mockError = new Error('Failed to update bill');
            mockNest.finance.bill.update.mockRejectedValue(mockError);

            await expect(
                service.update(mockEntity.id, params),
            ).rejects.toThrow('Failed to update bill');
        });
    });

    describe('getAll', () => {
        it('should successfully getAll bill list', async () => {
            mockNest.finance.bill.getAll.mockResolvedValue(mockEntityList);
            const result = await service.getAll({});
            expect(mockNest.finance.bill.getAll).toHaveBeenCalledWith({}, undefined);
            expect(result).toEqual(mockEntityList);
        });

        it('should successfully getAll bill list paginate', async () => {
            mockNest.finance.bill.getAll.mockResolvedValue(mockEntityPaginate);
            const result = await service.getAll(mockPaginateParams);

            expect(mockNest.finance.bill.getAll).toHaveBeenCalledWith(
                mockPaginateParams,
                undefined
            );
            expect(result).toEqual(mockEntityPaginate);
        });
    });
});