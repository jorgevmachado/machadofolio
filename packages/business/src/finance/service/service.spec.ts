import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { type Nest } from '../../api';

import { FINANCE_MOCK } from '../mock';
import { FinanceService } from './service';

jest.mock('../../api');

describe('Finance Service', () => {
    const mockEntity = FINANCE_MOCK;
    let service: FinanceService;
    let mockNest: jest.Mocked<Nest>;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockNest = {
            finance: {
                find: jest.fn(),
                initialize: jest.fn(),
            }
        } as unknown as jest.Mocked<Nest>;

        service = new FinanceService(mockNest);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        xit('should be instantiated correctly', () => {
            expect(service).toBeDefined();
        });

        xit('should receive the Nest dependency in the constructor', () => {
            expect(service['nest']).toBe(mockNest);
        });
    });

    describe('initialize', () => {
        xit('should initialize the finance', async () => {
            mockNest.finance.initialize.mockResolvedValue({
                ...mockEntity,
                bills: undefined,
                groups: undefined,
            });
            const result = await service.initialize();
            expect(mockNest.finance.initialize).toHaveBeenCalled();
            expect(result.id).toEqual(mockEntity.id);
            expect(result.user.id).toEqual(mockEntity.user.id);
            expect(result.bills).toBeUndefined();
            expect(result.groups).toBeUndefined();
        });
    });

    describe('find', () => {
        xit('should find the finance', async () => {
            const mockResponse = {
                bills: [],
                total: 0,
                banks: [],
                groups: [],
                finance: mockEntity,
                allPaid: false,
                suppliers: [],
                totalPaid: 0,
                expenses: [],
                totalPending: 0,
                supplierTypes: []
            }
            mockNest.finance.find.mockResolvedValue(mockResponse);
            const result = await service.find();
            expect(mockNest.finance.find).toHaveBeenCalled();
            expect(result.bills).toHaveLength(0);
            expect(result.total).toBe(0);
            expect(result.banks).toHaveLength(0);
            expect(result.groups).toHaveLength(0);
            expect(result.allPaid).toBeFalsy();
            expect(result.expenses).toHaveLength(0);
            expect(result.suppliers).toHaveLength(0);
            expect(result.totalPaid).toBe(0);
            expect(result.totalPending).toBe(0);
            expect(result.supplierTypes).toHaveLength(0);

            expect(result.finance.id).toEqual(mockEntity.id);
            expect(result.finance.user).toEqual(mockEntity.user);
            expect(result.finance.bills).toHaveLength(1);
            expect(result.finance.groups).toBeUndefined();
            expect(result.finance.created_at).toEqual(mockEntity.created_at);
            expect(result.finance.updated_at).toEqual(mockEntity.updated_at);
            expect(result.finance.deleted_at).toEqual(mockEntity.deleted_at);
        });
    });
});