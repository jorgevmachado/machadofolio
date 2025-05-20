import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import BillBusiness from '@repo/business/finance/bill/business/business';
import { EExpenseType } from '@repo/business/finance/expense/enum';

import { BILL_MOCK } from '../../mocks/bill.mock';
import { Bill } from '../entities/bill.entity';
import { EXPENSE_MOCK } from '../../mocks/expense.mock';
import { type Expense } from '../entities/expense.entity';
import { FINANCE_MOCK } from '../../mocks/finance.mock';
import { type Finance } from '../entities/finance.entity';
import { SUPPLIER_MOCK } from '../../mocks/supplier.mock';
import { type Supplier } from '../entities/supplier.entity';

import { BankService } from '../bank/bank.service';
import { BillService } from './bill.service';
import { CategoryService } from '../category/category.service';
import { type CreateBillDto } from './dto/create-bill.dto';
import { ExpenseService } from './expense/expense.service';

import { ConflictException } from '@nestjs/common';
import { type UpdateBillDto } from './dto/update-bill.dto';
import { type UpdateExpenseDto } from './expense/dto/update-expense.dto';


describe('BillService', () => {
    let service: BillService;
    let bankService: BankService;
    let categoryService: CategoryService;
    let expenseService: ExpenseService;
    let repository: Repository<Bill>;

    const mockEntity: Bill = BILL_MOCK;
    const expenseMockEntity: Expense = EXPENSE_MOCK;
    const supplierMockEntity: Supplier = SUPPLIER_MOCK;
    const financeMockEntity: Finance = FINANCE_MOCK;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BillService,
                BillBusiness,
                { provide: getRepositoryToken(Bill), useClass: Repository },
                {
                    provide: BankService,
                    useValue: {
                        seeds: jest.fn(),
                        treatEntityParam: jest.fn(),
                    },
                },
                {
                    provide: ExpenseService,
                    useValue: {
                        initialize: jest.fn(),
                        customSave: jest.fn(),
                        findOne: jest.fn(),
                        buildForCreation: jest.fn(),
                        buildForUpdate: jest.fn(),
                        addExpenseForNextYear: jest.fn(),
                        treatEntitiesParams: jest.fn(),
                        findAll: jest.fn(),
                        seeds: jest.fn(),
                        softRemove: jest.fn(),
                        supplierSeeds: jest.fn(),
                    },
                },
                {
                    provide: CategoryService,
                    useValue: {
                        seeds: jest.fn(),
                        treatEntityParam: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<BillService>(BillService);
        bankService = module.get<BankService>(BankService);
        categoryService = module.get<CategoryService>(CategoryService);
        expenseService = module.get<ExpenseService>(ExpenseService);
        repository = module.get<Repository<Bill>>(getRepositoryToken(Bill));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(bankService).toBeDefined();
        expect(categoryService).toBeDefined();
        expect(expenseService).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('create', () => {
        it('should create a bill successfully without expenses list', async () => {
            const createBill: CreateBillDto = {
                type: mockEntity.type,
                year: mockEntity.year,
                bank: mockEntity.bank.name,
                category: mockEntity.category.name,
            };
            jest
                .spyOn(bankService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.bank);

            jest
                .spyOn(categoryService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.category);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(null),
            } as any);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

            expect(await service.create(financeMockEntity, createBill)).toEqual(mockEntity);
        });

        it('should return error when exist one bill with this name', async () => {
            const createBill: CreateBillDto = {
                type: mockEntity.type,
                year: mockEntity.year,
                bank: mockEntity.bank.name,
                category: mockEntity.category.name,
            };
            jest
                .spyOn(bankService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.bank);

            jest
                .spyOn(categoryService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.category);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

            await expect(
                service.create(financeMockEntity, createBill),
            ).rejects.toThrowError(ConflictException);
        });
    });

    describe('update', () => {
        it('should update a bill successfully without year', async () => {
            const updateBill: UpdateBillDto = {
                type: mockEntity.type,
                bank: mockEntity.bank.name,
                category: mockEntity.category.name,
                expenses: mockEntity.expenses,
            };

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            jest
                .spyOn(bankService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.bank);

            jest
                .spyOn(categoryService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.category);

            if (mockEntity.expenses) {
                jest
                    .spyOn(expenseService, 'treatEntitiesParams')
                    .mockResolvedValueOnce(mockEntity.expenses);
            }

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(null),
            } as any);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

            expect(
                await service.update(financeMockEntity, mockEntity.id, updateBill),
            ).toEqual(mockEntity);
        });

        it('should update a bill successfully with only year', async () => {

            const updateBill: UpdateBillDto = {
                year: mockEntity.year,
            };

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(null),
            } as any);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

            expect(
                await service.update(financeMockEntity, mockEntity.id, updateBill),
            ).toEqual(mockEntity);
        });
    });

    describe('remove', () => {
        it('should remove bill when there are no associated expenses', async () => {
            const expected: Bill = {
                ...mockEntity,
                expenses: [],
            };
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(expected),
            } as any);
            jest.spyOn(repository, 'softRemove').mockResolvedValueOnce({
                ...expected,
                deleted_at: mockEntity.created_at,
            });
            expect(await service.remove(mockEntity.id)).toEqual({
                message: 'Successfully removed',
            });
        });

        it('should throw a ConflictException when bill is in use', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            await expect(
                service.remove(mockEntity.id),
            ).rejects.toThrowError(ConflictException);
        });
    });

    describe('addExpense', () => {
        const expenseParams = {
            type: EExpenseType.FIXED,
            paid: true,
            value: 93.59,
            supplier: supplierMockEntity.name,
            instalment_number: 1,
        };
        const nextYear = mockEntity.year + 1;
        const requiresNewBill = true;
        const monthsForNextYear = ['january', 'february', 'march'];
        const expenseForNextYear = { ...expenseMockEntity };
        monthsForNextYear.forEach((month) => {
            expenseForNextYear[month] = 93.59;
            expenseForNextYear[`${month}_paid`] = true;
        });
        const expenseForCurrentYear = { ...expenseMockEntity };
        it('should create a expense successfully with expense type fixed and set bill id', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            jest.spyOn(expenseService, 'buildForCreation').mockResolvedValueOnce(expenseForCurrentYear);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getMany: jest.fn().mockReturnValueOnce([]),
            } as any);

            jest.spyOn(expenseService, 'initialize').mockResolvedValueOnce({
                nextYear,
                requiresNewBill: false,
                monthsForNextYear: undefined,
                expenseForNextYear: undefined,
                expenseForCurrentYear,
            });

            const result = await service.addExpense(mockEntity.id, expenseParams);
            expect(result).toEqual(expenseForCurrentYear);
        });

        it('should create a expense successfully with expense type variable and set bill id', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            jest.spyOn(expenseService, 'buildForCreation').mockResolvedValueOnce(expenseForCurrentYear);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getMany: jest.fn().mockReturnValueOnce([]),
            } as any);

            jest.spyOn(expenseService, 'initialize').mockResolvedValueOnce({
                nextYear,
                requiresNewBill,
                monthsForNextYear,
                expenseForNextYear,
                expenseForCurrentYear,
            });

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(null),
            } as any);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getMany: jest.fn().mockReturnValueOnce([]),
            } as any);

            jest.spyOn(expenseService, 'addExpenseForNextYear').mockResolvedValueOnce(expenseForNextYear);

            const result = await service.addExpense(mockEntity.id, expenseParams);
            expect(result).toEqual(expenseForCurrentYear);
        });

        it('should create a expense successfully with expense type variable and get bill existent', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            jest.spyOn(expenseService, 'buildForCreation').mockResolvedValueOnce(expenseForCurrentYear);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getMany: jest.fn().mockReturnValueOnce([mockEntity]),
            } as any);

            jest.spyOn(expenseService, 'initialize').mockResolvedValueOnce({
                nextYear,
                requiresNewBill,
                monthsForNextYear,
                expenseForNextYear,
                expenseForCurrentYear,
            });

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getMany: jest.fn().mockReturnValueOnce([]),
            } as any);

            jest.spyOn(expenseService, 'addExpenseForNextYear').mockResolvedValueOnce(expenseForNextYear);

            const result = await service.addExpense(mockEntity.id, expenseParams);
            expect(result).toEqual(expenseForCurrentYear);
        });
    });

    describe('findOneExpense', () => {
        it('should return an expense successfully', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            jest.spyOn(expenseService, 'findOne').mockResolvedValueOnce(expenseMockEntity);

            expect(await service.findOneExpense(mockEntity.id, expenseMockEntity.id)).toEqual(expenseMockEntity);
        });
    });

    describe('findAllExpense', () => {
        it('should return an expense successfully', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            jest.spyOn(expenseService, 'findAll').mockResolvedValueOnce([expenseMockEntity]);

            expect(await service.findAllExpense(mockEntity.id, {})).toEqual([expenseMockEntity]);
        });
    });

    describe('removeExpense', () => {
        it('should remove an expense successfully', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            jest.spyOn(expenseService, 'findOne').mockResolvedValueOnce(expenseMockEntity);
            jest.spyOn(expenseService, 'softRemove').mockResolvedValueOnce(expenseMockEntity);

            expect(await service.removeExpense(mockEntity.id, expenseMockEntity.id)).toEqual({
                message: 'Successfully removed',
            });
        });
    });

    describe('updateExpense', () => {
        it('should update a expense successfully', async () => {
            const updateExpenseParams: UpdateExpenseDto = {
                january: 100
            };
            const expectedExpense: Expense = {...expenseMockEntity, january: 100 };

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            jest.spyOn(expenseService, 'findOne').mockResolvedValueOnce(expenseMockEntity);
            jest.spyOn(expenseService, 'buildForUpdate').mockResolvedValueOnce(expectedExpense);
            jest.spyOn(expenseService, 'customSave').mockResolvedValueOnce(expectedExpense);

            const result = await service.updateExpense(mockEntity.id, expenseMockEntity.id, updateExpenseParams) as Expense;
            expect(result.january).toEqual(expectedExpense.january);
        });

        it('should return an error when trying to update an expense with an existing name', async () => {
            const newSupplier: Supplier = {
                ...expenseMockEntity.supplier,
                name: 'New Supplier',
                name_code: 'new_supplier'
            }
            const updateExpenseParams: UpdateExpenseDto = {
                supplier: 'New Supplier',
            };

            const expectedExpense: Expense = {
                ...expenseMockEntity,
                supplier: newSupplier,
                name: `${mockEntity.name} ${newSupplier.name}`,
                name_code: `${mockEntity.name_code}_${newSupplier.name_code}`,
            };

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            jest.spyOn(expenseService, 'findOne').mockResolvedValueOnce(expenseMockEntity);
            jest.spyOn(expenseService, 'buildForUpdate').mockResolvedValueOnce(expectedExpense);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getMany: jest.fn().mockReturnValueOnce([{
                    ...mockEntity,
                    expenses: [expectedExpense]
                }]),
            } as any);

            await expect(service.updateExpense(mockEntity.id, expenseMockEntity.id, updateExpenseParams)).rejects.toThrowError(ConflictException);
        });
    });

    describe('seeds', () => {
        it('should seed the database when exist in database', async () => {
            jest.spyOn(bankService, 'seeds').mockResolvedValueOnce([mockEntity.bank]);

            jest.spyOn(categoryService, 'seeds').mockResolvedValueOnce([mockEntity.category]);

            jest.spyOn(repository, 'find').mockResolvedValueOnce([mockEntity]);

            expect(await service.seeds({
                finance: financeMockEntity,
                bankListJson: [mockEntity.bank],
                billListJson: [mockEntity],
                categoryListJson: [mockEntity.category],
            })).toEqual([mockEntity]);
        });

        it('should seed the database when not exist in database', async () => {
            jest.spyOn(bankService, 'seeds').mockResolvedValueOnce([mockEntity.bank]);

            jest.spyOn(categoryService, 'seeds').mockResolvedValueOnce([mockEntity.category]);

            jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);
            expect(await service.seeds({
                finance: financeMockEntity,
                bankListJson: [mockEntity.bank],
                billListJson: [mockEntity],
                categoryListJson: [mockEntity.category],
            })).toEqual([mockEntity]);
        });

        it('Should return a seed empty when received a empty list', async () => {
            jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
            expect(await service.seeds({ finance: financeMockEntity })).toEqual([]);
        });
    });

    describe('billCategoryService', () => {
        it('Should return the category service instance', () => {
            const result = service.category;

            expect(result).toBeDefined();
            expect(result).toBe(categoryService);
        });
    });

    describe('billBankService', () => {
        it('Should return the bank service instance', () => {
            const result = service.bank;

            expect(result).toBeDefined();
            expect(result).toBe(bankService);
        });
    });

    describe('billExpenseService', () => {
        it('Should return the expense service instance', () => {
            const result = service.expense;

            expect(result).toBeDefined();
            expect(result).toBe(expenseService);
        });
    });
});
