import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';
import { BILL_CATEGORY_MOCK } from './mock';
import BillCategory from './bill-category';
import type { BillCategoryConstructorParams } from './types';

describe('BillCategory', () => {
    const billCategoryMock = BILL_CATEGORY_MOCK;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('constructor', () => {
        it('should create an instance with all parameters when valid data is provided', () => {
            const params: BillCategoryConstructorParams = billCategoryMock;

            const billCategory = new BillCategory(params);

            expect(billCategory.id).toBe(params.id);
            expect(billCategory.name).toBe(params.name);
            expect(billCategory.created_at).toEqual(params.created_at);
            expect(billCategory.updated_at).toEqual(params.updated_at);
            expect(billCategory.deleted_at).toBeUndefined();
        });

        it('should create an instance with minimal valid data', () => {
            const params: BillCategoryConstructorParams = {
                name: 'Bill B',
            };

            const billCategory = new BillCategory(params);

            expect(billCategory.id).toBeUndefined();
            expect(billCategory.name).toBe(params.name);
            expect(billCategory.created_at).toBeUndefined();
            expect(billCategory.updated_at).toBeUndefined();
            expect(billCategory.deleted_at).toBeUndefined();
        });

        it('should allow instantiation with no parameters', () => {
            const billCategory = new BillCategory();

            expect(billCategory.id).toBeUndefined();
            expect(billCategory.name).toBeUndefined();
            expect(billCategory.created_at).toBeUndefined();
            expect(billCategory.updated_at).toBeUndefined();
            expect(billCategory.deleted_at).toBeUndefined();
        });
    });
});