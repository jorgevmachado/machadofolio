import { Repository } from 'typeorm';

import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { getRepositoryToken } from '@nestjs/typeorm';

import { ExpenseBusiness } from '@repo/business';

import { EXPENSE_MOCK, EXPENSE_MONTH_MOCK } from '../../../mocks/expense.mock';

import { Expense } from '../../entities/expense.entity';
import { type Month } from '../../entities/month.entity';

import { MonthService } from '../../month/month.service';
import { SupplierService } from '../../supplier/supplier.service';
import { ExpenseService } from './expense.service';

jest.mock('../../../shared', () => {
    class ServiceMock {
        save = jest.fn();
        error = jest.fn().mockImplementation((err) => {
            throw err;
        });
        seeder = {
            entities: jest.fn(),
            getRelation: jest.fn(),
            currentSeeds: jest.fn(),
        };
        findAll = jest.fn();
        findOne = jest.fn();
    }

    return { Service: ServiceMock }
});

jest.mock('../../supplier/supplier.service', () => {
    class SupplierServiceMock {
        findOne = jest.fn();
        createToSheet = jest.fn();
        treatEntityParam = jest.fn();
    }

    return { SupplierService: SupplierServiceMock };
});

describe('ExpenseService', () => {
    let service: ExpenseService;
    let expenseBusiness: ExpenseBusiness;
    let supplierService: SupplierService;
    let monthService: MonthService;
    let repository: Repository<Expense>;
    const mockMonthEntity: Month = EXPENSE_MONTH_MOCK
    const mockEntity: Expense = { ...EXPENSE_MOCK, months: [mockMonthEntity] };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExpenseService,
                {
                    provide: ExpenseBusiness,
                    useValue: {
                        spreadsheet: {
                            buildForCreation: jest.fn(),
                            parseToDetailsTable: jest.fn(),
                        },
                        initialize: jest.fn(),
                        reinitialize: jest.fn(),
                        calculate: jest.fn(),
                    }
                },
                { provide: getRepositoryToken(Expense), useClass: Repository },
                {
                    provide: SupplierService,
                    useValue: {
                        findOne: jest.fn(),
                        createToSheet: jest.fn(),
                        treatEntityParam: jest.fn(),
                    },
                },
                {
                    provide: MonthService,
                    useValue: {
                        business: {
                            generatePersistMonthParams: jest.fn(),
                            generateMonthListUpdateParameters: jest.fn(),
                            generateMonthListCreationParameters: jest.fn(),
                        },
                        persistList: jest.fn(),
                        updateByRelationship: jest.fn(),
                    }
                }
            ],
        }).compile();

        service = module.get<ExpenseService>(ExpenseService);
        supplierService = module.get<SupplierService>(SupplierService);
        monthService = module.get<MonthService>(MonthService);
        repository = module.get<Repository<Expense>>(getRepositoryToken(Expense));
        expenseBusiness = module.get<ExpenseBusiness>(ExpenseBusiness);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(supplierService).toBeDefined();
        expect(monthService).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('business', () => {
        it('should return expense business module', () => {
            expect(service.business).toBe(expenseBusiness);
        });
    });

    // describe('create', () => {
    //     it('should save a expense successfully', async () => {
    //         jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(mockEntity);
    //
    //         jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
    //
    //         jest.spyOn(monthService.business, 'generatePersistMonthParams').mockReturnValue(mockMonthEntity);
    //         jest.spyOn(monthService.business, 'generateMonthListCreationParameters').mockReturnValue([]);
    //
    //         const result = await service.create(mockEntity.bill, mockEntity);
    //         expect(result).toEqual(mockEntity);
    //     })
    //
    //     it('should save a expense with months successfully', async () => {
    //         jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(mockEntity);
    //
    //         jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
    //
    //         if (mockEntity.months) {
    //             jest.spyOn(monthService.business, 'generatePersistMonthParams').mockReturnValue(mockMonthEntity);
    //             jest.spyOn(monthService.business, 'generateMonthListCreationParameters').mockReturnValue(mockEntity.months);
    //             jest.spyOn(monthService, 'persistList').mockResolvedValueOnce(mockEntity.months.map((month) => ({
    //                 ...month,
    //                 expense: undefined,
    //                 income: undefined
    //             })));
    //             jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(mockEntity);
    //             jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
    //         }
    //
    //         const result = await service.create(mockEntity, ['january'], 100);
    //         expect(result).toEqual(mockEntity);
    //     })
    // });

    // describe('update', () => {
    //     it('must update an expense successfully without change months.', async () => {
    //         jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
    //         jest.spyOn(supplierService, 'treatEntityParam').mockResolvedValueOnce(mockEntity.supplier);
    //         jest.spyOn(monthService.business, 'generateMonthListUpdateParameters').mockReturnValue([]);
    //         jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(mockEntity);
    //         jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
    //         const result = await service.update(mockEntity.id, mockEntity);
    //         expect(result).toEqual(mockEntity);
    //     })
    //
    //     it('should update a expense successfully with change supplier', async () => {
    //         const mockNewSupplier = { ...mockEntity.supplier, name: 'new supplier' };
    //         jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
    //         jest.spyOn(supplierService, 'treatEntityParam').mockResolvedValueOnce(mockNewSupplier);
    //         jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);
    //         jest.spyOn(monthService.business, 'generateMonthListUpdateParameters').mockReturnValue([]);
    //         jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(mockEntity);
    //         jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
    //         const result = await service.update(mockEntity.id, mockEntity);
    //         expect(result).toEqual(mockEntity);
    //     })
    //
    //     it('should update a expense successfully with months', async () => {
    //         jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
    //         jest.spyOn(supplierService, 'treatEntityParam').mockResolvedValueOnce(mockEntity.supplier);
    //         jest.spyOn(monthService.business, 'generateMonthListUpdateParameters').mockReturnValue(mockEntity.months);
    //         jest.spyOn(monthService, 'persistList').mockResolvedValueOnce([mockMonthEntity].map((month) => ({
    //             ...month,
    //             expense: undefined,
    //             income: undefined
    //         })));
    //         jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(mockEntity);
    //         jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
    //         const result = await service.update(mockEntity.id, { months: mockEntity.months });
    //         expect(result).toEqual(mockEntity);
    //     })
    //
    //     it('should return a error when try to update expense with change supplier e name_code', async () => {
    //         console.log('TESTE: Iniciando teste de conflito de supplier e name_code');
    //         const mockNewSupplier = { ...mockEntity.supplier, id: 'different-id', name: 'new supplier' };
    //         jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
    //         jest.spyOn(supplierService, 'treatEntityParam').mockResolvedValueOnce(mockNewSupplier);
    //         jest.spyOn(service, 'findAll').mockResolvedValueOnce([{ ...mockEntity, supplier: mockNewSupplier }]);
    //         await expect(service.update(mockEntity.id, { supplier: mockNewSupplier })).rejects.toThrowError(ConflictException);
    //     })
    // });

    // describe('seeds', () => {
    //     it('Should return a seed empty when received a empty list', async () => {
    //         jest.spyOn(service.seeder, 'currentSeeds').mockReturnValueOnce([]);
    //         jest.spyOn(service.seeder, 'currentSeeds').mockReturnValueOnce([]);
    //
    //         jest.spyOn(service.seeder, 'entities').mockResolvedValueOnce([]);
    //         jest.spyOn(service.seeder, 'entities').mockResolvedValueOnce([]);
    //
    //         expect(await service.seeds({ bills: [mockEntity.bill], suppliers: [mockEntity.supplier] })).toEqual([]);
    //     });
    //
    //     it('should seed the database when exist in database', async () => {
    //         const mock = {
    //             ...mockEntity,
    //             parent: undefined,
    //             children: [mockEntity],
    //             is_aggregate: false,
    //             aggregate_name: undefined,
    //         }
    //
    //         jest.spyOn(service.seeder, 'currentSeeds').mockReturnValueOnce([mock]);
    //         jest.spyOn(service.seeder, 'currentSeeds').mockReturnValueOnce([{
    //             ...mockEntity.bill,
    //             expenses: [mockEntity]
    //         }]);
    //
    //         jest.spyOn(service.seeder, 'entities').mockImplementation(async ({ createdEntityFn }: any) => {
    //             createdEntityFn(mock);
    //             return [mock];
    //         });
    //
    //         jest.spyOn(service, 'createdEntity' as any).mockResolvedValueOnce(mock);
    //
    //         jest.spyOn(service.seeder, 'entities').mockImplementation(async ({ createdEntityFn }: any) => {
    //             createdEntityFn(mock);
    //             return [mock];
    //         });
    //
    //         jest.spyOn(service, 'createdEntity' as any).mockResolvedValueOnce(mock);
    //
    //         jest.spyOn(service.seeder, 'getRelation').mockReturnValueOnce(mockEntity.supplier);
    //
    //         const result = await service.seeds({
    //             bills: [{ ...mockEntity.bill, expenses: [mockEntity] }],
    //             suppliers: [mockEntity.supplier],
    //             expenseListJson: [mock],
    //             billListJson: [{ ...mockEntity.bill, expenses: [mockEntity] }]
    //         })
    //
    //         expect(result).toHaveLength(1);
    //     });
    //
    //     it('should seed the database when bill in list of bill has undefined expenses', async () => {
    //         const mock = {
    //             ...mockEntity,
    //             parent: undefined,
    //             children: [mockEntity],
    //             is_aggregate: false,
    //             aggregate_name: undefined,
    //         }
    //
    //         jest.spyOn(service.seeder, 'currentSeeds').mockReturnValueOnce([mock]);
    //         jest.spyOn(service.seeder, 'currentSeeds').mockReturnValueOnce([{ ...mock.bill, expenses: undefined }]);
    //         (filterByCommonKeys as jest.Mock).mockReturnValue([]);
    //
    //         jest.spyOn(service.seeder, 'entities').mockImplementation(async () => []);
    //
    //         jest.spyOn(service.seeder, 'entities').mockImplementation(async () => []);
    //
    //         const result = await service.seeds({
    //             bills: [{ ...mock.bill, expenses: [mockEntity] }],
    //             suppliers: [mock.supplier],
    //             expenseListJson: [mock],
    //             billListJson: [{ ...mock.bill, expenses: [mockEntity] }]
    //         })
    //
    //         expect(result).toHaveLength(0);
    //     });
    //
    //     it('should seed the database when expense in list of expenses has a id undefined in children parent', async () => {
    //         const mock = {
    //             ...mockEntity,
    //             parent: undefined,
    //             children: [mockEntity],
    //             is_aggregate: false,
    //             aggregate_name: undefined,
    //         }
    //
    //         jest.spyOn(service.seeder, 'currentSeeds').mockReturnValueOnce([mock]);
    //         jest.spyOn(service.seeder, 'currentSeeds').mockReturnValueOnce([{ ...mock.bill, expenses: [mockEntity] }]);
    //
    //         jest.spyOn(service, 'flattenParentsAndChildren' as any).mockReturnValue([{
    //             ...mock,
    //             parent: { ...mock, id: undefined, children: undefined }
    //         }]);
    //
    //         jest.spyOn(service.seeder, 'entities').mockImplementation(async () => [mock]);
    //         jest.spyOn(service, 'createdEntity' as any).mockResolvedValueOnce(mock);
    //
    //
    //         jest.spyOn(service.seeder, 'entities').mockImplementation(async () => [mock]);
    //         jest.spyOn(service, 'createdEntity' as any).mockResolvedValueOnce(mock);
    //
    //         const result = await service.seeds({
    //             bills: [{ ...mock.bill, expenses: [mockEntity] }],
    //             suppliers: [mock.supplier],
    //             expenseListJson: [mock],
    //             billListJson: [{ ...mock.bill, expenses: [mockEntity] }]
    //         })
    //
    //         expect(result).toHaveLength(1);
    //     });
    // });

    describe('privates', () => {

        // describe('validateExistExpense', () => {
        //     it('should valid expense.', async () => {
        //         jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);
        //         await service['validateExistExpense'](mockEntity.bill,  mockEntity);
        //         expect(service.error).not.toHaveBeenCalled();
        //     });
        //
        //     it('should throw error when found expense.', async () => {
        //         jest.spyOn(service, 'findAll').mockResolvedValueOnce([mockEntity]);
        //         jest.spyOn(service, 'error').mockImplementation((err) => {
        //             throw err;
        //         });
        //         await expect(service['validateExistExpense'](mockEntity.bill, mockEntity)).rejects.toThrowError(ConflictException);
        //     });
        // });

        // describe('buildExpenseToSheet', () => {
        //     it('Should build all expense to createToSheet with default values.', () => {
        //         const params = {
        //             year: '2025',
        //             bill: { ...mockEntity.bill, name: 'Bill' },
        //         }
        //
        //         const result = service['buildExpenseToSheet'](params);
        //
        //         expect(result.year).toEqual(2025);
        //         expect(result.type).toEqual(EExpenseType.VARIABLE);
        //         expect(result.name).toEqual('Bill ');
        //         expect(result.children).toBeUndefined();
        //         expect(result.bill.name).toEqual('Bill');
        //         expect(result.description).toEqual('Generated by a spreadsheet.');
        //         expect(result.is_aggregate).toBeFalsy();
        //         expect(result.supplierName).toEqual('');
        //         expect(result.aggregate_name).toBeUndefined();
        //     });
        //
        //     it('Should build all expense to createToSheet with all values.', () => {
        //         const params = {
        //             year: '2025',
        //             type: 'FIXED',
        //             bill: { ...mockEntity.bill, name: 'Bill' },
        //             children: [{ ...mockEntity.bill, name: 'Bill' }],
        //             supplier: 'Supplier',
        //             is_aggregate: true,
        //             aggregate_name: 'Aggregate Name'
        //         }
        //
        //         const result = service['buildExpenseToSheet'](params);
        //
        //         expect(result.year).toEqual(2025);
        //         expect(result.type).toEqual(EExpenseType.FIXED);
        //         expect(result.name).toEqual('Bill Aggregate Name Supplier');
        //         expect(result.children).toHaveLength(1);
        //         expect(result.bill.name).toEqual('Bill');
        //         expect(result.description).toEqual('Generated by a spreadsheet.');
        //         expect(result.is_aggregate).toBeTruthy();
        //         expect(result.supplierName).toEqual('Supplier');
        //         expect(result.aggregate_name).toEqual('Aggregate Name');
        //     });
        // });
    });
});