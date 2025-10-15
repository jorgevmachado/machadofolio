import { Readable } from 'stream';

jest.mock('../../shared', () => {
    class ServiceMock {
        save = jest.fn();
        error = jest.fn();
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

jest.mock('../bank/bank.service', () => {
    class BankServiceMock {
        seeds = jest.fn();
        createToSheet = jest.fn();
        treatEntityParam = jest.fn();
    }
    return { BankService: BankServiceMock }
});

jest.mock('./expense/expense.service', () => {
    class ExpenseServiceMock {
        initialize =  jest.fn();
        customSave =  jest.fn();
        findOne =  jest.fn();
        buildForCreation =  jest.fn();
        buildForUpdate =  jest.fn();
        addExpenseForNextYear =  jest.fn();
        treatEntitiesParams =  jest.fn();
        findAll =  jest.fn();
        seeds =  jest.fn();
        softRemove =  jest.fn();
        supplierSeeds =  jest.fn();
        getExpensesFromSheet =  jest.fn();
        business = {
            allHaveBeenPaid: jest.fn(),
            buildTablesParams: jest.fn()
        }
    }
    return { ExpenseService: ExpenseServiceMock }
});

jest.mock('../group/group.service', () => {
    class GroupServiceMock {
        seeds = jest.fn();
        createToSheet = jest.fn();
        treatEntityParam = jest.fn();
    }
    return { GroupService: GroupServiceMock }
});

jest.mock('', () => {});

import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { type CycleOfMonths, MONTHS, type TMonth, filterByCommonKeys } from '@repo/services';

import { BillBusiness, EBillType, EExpenseType } from '@repo/business';

import { spreadsheetMock } from '../../../jest.setup';

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
import { type CreateBillDto } from './dto/create-bill.dto';
import { ExpenseService } from './expense/expense.service';
import { GroupService } from '../group/group.service';

import { ConflictException, NotFoundException } from '@nestjs/common';
import { type UpdateBillDto } from './dto/update-bill.dto';
import { Buffer } from 'buffer';

describe('BillService', () => {
    let service: BillService;
    let business: BillBusiness;
    let bankService: BankService;
    let groupService: GroupService;
    let expenseService: ExpenseService;
    let repository: Repository<Bill>;

    const mockEntity: Bill = BILL_MOCK;
    const expenseMockEntity: Expense = EXPENSE_MOCK;
    const supplierMockEntity: Supplier = SUPPLIER_MOCK;
    const financeMockEntity: Finance = FINANCE_MOCK;
    const monthsObj = MONTHS.reduce((acc, month) => {
        acc[month] = 50;
        return acc;
    }, {} as CycleOfMonths);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BillService,
                {
                    provide: BillBusiness,
                    useValue: {
                        calculate: jest.fn().mockReturnValueOnce(mockEntity),
                        getWorkSheetTitle: jest.fn(),
                        spreadsheetProcessing: jest.fn(),
                    }
                },
                { provide: getRepositoryToken(Bill), useClass: Repository },
                {
                    provide: BankService,
                    useValue: {
                        seeds: jest.fn(),
                        createToSheet: jest.fn(),
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
                        update: jest.fn(),
                        addExpenseForNextYear: jest.fn(),
                        treatEntitiesParams: jest.fn(),
                        findAll: jest.fn(),
                        seeds: jest.fn(),
                        softRemove: jest.fn(),
                        supplierSeeds: jest.fn(),
                        getExpensesFromSheet: jest.fn(),
                        buildForCreationBySpreadsheet: jest.fn(),
                        business: {
                            allHaveBeenPaid: jest.fn(),
                            buildForCreation: jest.fn(),
                            buildTablesParams: jest.fn(),
                        }
                    },
                },
                {
                    provide: GroupService,
                    useValue: {
                        seeds: jest.fn(),
                        createToSheet: jest.fn(),
                        treatEntityParam: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<BillService>(BillService);
        business = module.get<BillBusiness>(BillBusiness);
        bankService = module.get<BankService>(BankService);
        groupService = module.get<GroupService>(GroupService);
        expenseService = module.get<ExpenseService>(ExpenseService);
        repository = module.get<Repository<Bill>>(getRepositoryToken(Bill));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(business).toBeDefined();
        expect(bankService).toBeDefined();
        expect(groupService).toBeDefined();
        expect(expenseService).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('create', () => {
        it('should create a bill successfully without expenses list', async () => {
            const createBill: CreateBillDto = {
                type: mockEntity.type,
                year: mockEntity.year,
                bank: mockEntity.bank.name,
                group: mockEntity.group.name,
            };
            jest
                .spyOn(bankService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.bank);

            jest
                .spyOn(groupService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.group);

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

            jest.spyOn(service, 'customSave' as any).mockResolvedValueOnce(mockEntity);

            expect(await service.create(financeMockEntity, createBill)).toEqual(mockEntity);
        });

        it('should create a bill successfully with type credit card', async () => {
            const createBill: CreateBillDto = {
                type: EBillType.CREDIT_CARD,
                year: mockEntity.year,
                bank: mockEntity.bank.name,
                group: mockEntity.group.name,
            };
            jest
                .spyOn(bankService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.bank);

            jest
                .spyOn(groupService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.group);

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

            jest.spyOn(service, 'customSave' as any).mockResolvedValueOnce({...mockEntity, type: EBillType.CREDIT_CARD});

            expect(await service.create(financeMockEntity, createBill)).toEqual({...mockEntity, type: EBillType.CREDIT_CARD});
        });

        it('should return error when exist one bill with this name', async () => {
            const createBill: CreateBillDto = {
                type: mockEntity.type,
                year: mockEntity.year,
                bank: mockEntity.bank.name,
                group: mockEntity.group.name,
            };
            jest
                .spyOn(bankService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.bank);

            jest
                .spyOn(groupService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.group);

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

            jest.spyOn(service, 'error').mockImplementationOnce(() => { throw new ConflictException(); });

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
                group: mockEntity.group.name,
                expenses: mockEntity.expenses,
            };

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

            jest
                .spyOn(bankService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.bank);

            jest
                .spyOn(groupService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.group);

            if (mockEntity.expenses) {
                jest
                    .spyOn(expenseService, 'treatEntitiesParams')
                    .mockResolvedValueOnce(mockEntity.expenses);
            }

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

            jest.spyOn(service, 'customSave' as any).mockResolvedValueOnce(mockEntity);

            expect(
                await service.update(financeMockEntity, mockEntity.id, updateBill),
            ).toEqual(mockEntity);
        });

        it('should update a bill successfully with type credit card', async () => {
            const updateBill: UpdateBillDto = {
                type: EBillType.CREDIT_CARD,
                bank: mockEntity.bank.name,
                group: mockEntity.group.name,
                expenses: mockEntity.expenses,
            };

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

            jest
                .spyOn(bankService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.bank);

            jest
                .spyOn(groupService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.group);

            if (mockEntity.expenses) {
                jest
                    .spyOn(expenseService, 'treatEntitiesParams')
                    .mockResolvedValueOnce(mockEntity.expenses);
            }

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

            jest.spyOn(service, 'customSave' as any).mockResolvedValueOnce({ ...mockEntity, type: EBillType.CREDIT_CARD});

            expect(
                await service.update(financeMockEntity, mockEntity.id, updateBill),
            ).toEqual({ ...mockEntity, type: EBillType.CREDIT_CARD});
        });

        it('should update a bill successfully with only year', async () => {

            const updateBill: UpdateBillDto = {
                year: mockEntity.year,
            };

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);


            jest.spyOn(service, 'customSave' as any).mockResolvedValueOnce(mockEntity);

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

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(expected);

            jest.spyOn(repository, 'softRemove').mockResolvedValueOnce({
                ...expected,
                deleted_at: mockEntity.created_at,
            });
            expect(await service.remove(mockEntity.id)).toEqual({
                message: 'Successfully removed',
            });
        });

        it('should throw a ConflictException when bill is in use', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

            jest.spyOn(service, 'error').mockImplementationOnce(() => { throw new ConflictException(); });

            await expect(
                service.remove(mockEntity.id),
            ).rejects.toThrowError(ConflictException);
        });
    });

    // describe('addExpense', () => {
    //     const expenseParams = {
    //         type: EExpenseType.FIXED,
    //         paid: true,
    //         value: 93.59,
    //         supplier: supplierMockEntity.name,
    //         instalment_number: 1,
    //     };
    //     const nextYear = mockEntity.year + 1;
    //     const requiresNewBill = true;
    //     const monthsForNextYear: Array<TMonth> = ['january', 'february', 'march'];
    //     const expenseForNextYear = { ...expenseMockEntity };
    //     monthsForNextYear.forEach((month) => {
    //         expenseForNextYear[month] = 93.59;
    //         expenseForNextYear[`${month}_paid`] = true;
    //     });
    //     const expenseForCurrentYear = { ...expenseMockEntity };
    //
    //     it('should create a expense successfully with expense type fixed and set bill id', async () => {
    //         jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
    //
    //         jest.spyOn(expenseService, 'buildForCreation').mockResolvedValueOnce(expenseForCurrentYear);
    //
    //         jest.spyOn(service, 'existExpenseInBill' as any).mockResolvedValueOnce(undefined);
    //
    //         jest.spyOn(expenseService, 'initialize').mockResolvedValueOnce({
    //             nextYear,
    //             requiresNewBill: false,
    //             monthsForNextYear: undefined,
    //             expenseForNextYear: undefined,
    //             monthsForCurrentYear: ['january'],
    //             expenseForCurrentYear
    //         });
    //
    //         const result = await service.addExpense(mockEntity.id, expenseParams);
    //         expect(result).toEqual(expenseForCurrentYear);
    //     });
    //
    //     it('should create a expense successfully with expense type variable and set bill id', async () => {
    //         jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
    //
    //         jest.spyOn(expenseService, 'buildForCreation').mockResolvedValueOnce(expenseForCurrentYear);
    //
    //         jest.spyOn(service, 'existExpenseInBill' as any).mockResolvedValueOnce([]);
    //
    //         jest.spyOn(expenseService, 'initialize').mockResolvedValueOnce({
    //             nextYear,
    //             requiresNewBill,
    //             monthsForNextYear,
    //             expenseForNextYear,
    //             monthsForCurrentYear: ['january'],
    //             expenseForCurrentYear,
    //         });
    //
    //         jest.spyOn(service, 'createNewBillForNextYear' as any).mockResolvedValueOnce(mockEntity);
    //
    //         jest.spyOn(service, 'existExpenseInBill' as any).mockResolvedValueOnce([]);
    //
    //         jest.spyOn(expenseService, 'addExpenseForNextYear').mockResolvedValueOnce(expenseForNextYear);
    //
    //         const result = await service.addExpense(mockEntity.id, expenseParams);
    //         expect(result).toEqual(expenseForCurrentYear);
    //     });
    //
    //     it('should create a expense successfully with expense type variable and get bill existent', async () => {
    //         jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
    //
    //         jest.spyOn(expenseService, 'buildForCreation').mockResolvedValueOnce(expenseForCurrentYear);
    //
    //         jest.spyOn(service, 'existExpenseInBill' as any).mockResolvedValueOnce([mockEntity]);
    //
    //         jest.spyOn(expenseService, 'initialize').mockResolvedValueOnce({
    //             nextYear,
    //             requiresNewBill,
    //             monthsForNextYear,
    //             expenseForNextYear,
    //             monthsForCurrentYear: ['january'],
    //             expenseForCurrentYear,
    //         });
    //
    //         jest.spyOn(service, 'createNewBillForNextYear' as any).mockResolvedValueOnce(mockEntity);
    //
    //         jest.spyOn(service, 'existExpenseInBill' as any).mockResolvedValueOnce([]);
    //
    //         jest.spyOn(expenseService, 'addExpenseForNextYear').mockResolvedValueOnce(expenseForNextYear);
    //
    //         const result = await service.addExpense(mockEntity.id, expenseParams);
    //         expect(result).toEqual(expenseForCurrentYear);
    //     });
    // });

    describe('findAllExpense', () => {
        it('should return an expense successfully', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

            jest.spyOn(expenseService, 'findAll').mockResolvedValueOnce([expenseMockEntity]);

            expect(await service.findAllExpense(mockEntity.id, {})).toEqual([expenseMockEntity]);
        });
    });

    // describe('seeds', () => {
    //     it('should seed the database when exist in database', async () => {
    //         jest.spyOn(bankService, 'seeds').mockResolvedValueOnce([mockEntity.bank]);
    //
    //         jest.spyOn(groupService, 'seeds').mockResolvedValueOnce([mockEntity.group]);
    //
    //         jest.spyOn(service.seeder, 'entities').mockResolvedValueOnce([mockEntity]);
    //
    //         expect(await service.seeds({
    //             banks: [mockEntity.bank],
    //             groups: [mockEntity.group],
    //             finance: financeMockEntity,
    //             billListJson: [mockEntity],
    //         })).toEqual([mockEntity]);
    //     });
    //
    //     it('should seed the database when not exist in database', async () => {
    //         const financeMock = {
    //             ...financeMockEntity,
    //             bills: [mockEntity]
    //         }
    //
    //         jest.spyOn(service.seeder, 'currentSeeds').mockReturnValueOnce([mockEntity]);
    //
    //         (filterByCommonKeys as jest.Mock).mockReturnValue([mockEntity]);
    //
    //         jest.spyOn(bankService, 'seeds').mockResolvedValueOnce([mockEntity.bank]);
    //
    //         jest.spyOn(groupService, 'seeds').mockResolvedValueOnce([mockEntity.group]);
    //
    //         jest.spyOn(service.seeder, 'entities').mockImplementation(async ({ createdEntityFn }: any) => {
    //             createdEntityFn(mockEntity)
    //             return [mockEntity];
    //         });
    //         expect(await service.seeds({
    //             banks: [mockEntity.bank],
    //             groups: [mockEntity.group],
    //             finance: financeMock,
    //             billListJson: [mockEntity],
    //         })).toEqual([mockEntity]);
    //     });
    //
    //     it('Should return a seed empty when received a empty list', async () => {
    //         jest.spyOn(service.seeder, 'entities').mockResolvedValueOnce([]);
    //         expect(await service.seeds({
    //             banks: [mockEntity.bank],
    //             groups: [mockEntity.group],
    //             finance: financeMockEntity,
    //         })).toEqual([]);
    //     });
    // });

    describe('billExpenseService', () => {
        it('Should return the expense service instance', () => {
            const result = service.expense;

            expect(result).toBeDefined();
            expect(result).toBe(expenseService);
        });
    });

    // describe('persistExpenseByUpload', () => {
    //     const mockedStream = new Readable();
    //     mockedStream.push('mock stream content');
    //     mockedStream.push(null);
    //     const mockFile: Express.Multer.File = {
    //         fieldname: 'file',
    //         originalname: 'test-image.jpeg',
    //         encoding: '7bit',
    //         mimetype: 'image/jpeg',
    //         size: 1024,
    //         buffer: Buffer.from('mock file content'),
    //         destination: 'uploads/',
    //         filename: 'test-image.jpeg',
    //         path: 'uploads/test-image.jpeg',
    //         stream: mockedStream,
    //     };
    //
    //     it('Should return trow error when dont have file', async () => {
    //         await expect(
    //             service.persistExpenseByUpload({ ...mockFile, buffer: undefined } as any, mockEntity.id, {})
    //         ).rejects.toThrowError(ConflictException);
    //     });
    //
    //     it('Should return trow error when dont worksheet', async () => {
    //         spreadsheetMock.loadFile.mockReturnValueOnce([undefined] as any);
    //         await expect(
    //             service.persistExpenseByUpload(mockFile, mockEntity.id, {})
    //         ).rejects.toThrowError(ConflictException);
    //     });
    //
    //     it('Should persist expense from upload file', async () => {
    //         jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
    //         spreadsheetMock.loadFile.mockReturnValueOnce([spreadsheetMock.workSheet] as any);
    //         Object.defineProperty(expenseService, 'business', {
    //             get: () => ({
    //                 spreadsheet: {
    //                     buildForCreation: jest.fn().mockReturnValue([expenseMockEntity]),
    //                 },
    //             }),
    //         });
    //         jest.spyOn(expenseService, 'buildForCreationBySpreadsheet').mockResolvedValueOnce([expenseMockEntity]);
    //         jest.spyOn(service, 'addExpensesByUpload' as any).mockResolvedValueOnce([expenseMockEntity]);
    //         const result = await service.persistExpenseByUpload(mockFile, mockEntity.id, { month: 'JANUARY' as any });
    //         expect(result).toHaveLength(1);
    //     });
    // });

    describe('privates', () => {
        describe('customSave', () => {
            it('should return error when exist bill and flag withThrow is true.', async () => {
                jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
                await expect(service['customSave'](mockEntity, true)).rejects.toThrow(ConflictException);
            });

            it('should return exist bill when flag withThrow is false.', async () => {
                jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
                expect(await service['customSave'](mockEntity, false)).toEqual(mockEntity);
            });

            it('should save bill when not exist in database.', async () => {
                jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
                jest.spyOn(business, 'calculate').mockReturnValue(mockEntity);
                jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
                expect(await service['customSave'](mockEntity)).toEqual(mockEntity);
            });
        });
    });
});
