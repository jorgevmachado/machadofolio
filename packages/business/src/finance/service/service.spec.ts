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
                initialize: jest.fn(),
            }
        } as unknown as jest.Mocked<Nest>;

        service = new FinanceService(mockNest);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should be instantiated correctly', () => {
            expect(service).toBeDefined();
        });

        it('should receive the Nest dependency in the constructor', () => {
            expect(service['nest']).toBe(mockNest);
        });
    });

    describe('initialize', () => {
        it('should initialize the finance', async () => {
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
});