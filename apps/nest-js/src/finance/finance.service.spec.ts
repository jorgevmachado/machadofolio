import { spreadsheetMock } from '../../jest.setup';

import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { Buffer } from 'buffer';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Readable } from 'stream';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { INCOME_MOCK, INCOME_MONTH_MOCK } from '../mocks/income.mock';
import { BANK_MOCK } from '../mocks/bank.mock';
import { BILL_MOCK } from '../mocks/bill.mock';
import { EXPENSE_MOCK } from '../mocks/expense.mock';
import { FINANCE_MOCK } from '../mocks/finance.mock';
import { GROUP_MOCK } from '../mocks/group.mock';
import { INCOME_SOURCE_MOCK } from '../mocks/income-source.mock';
import { SUPPLIER_MOCK } from '../mocks/supplier.mock';
import { SUPPLIER_TYPE_MOCK } from '../mocks/supplier-type.mock';
import { USER_MOCK } from '../mocks/user.mock';

import { type Bank } from './entities/bank.entity';
import type { Bill } from './entities/bill.entity';
import type { Expense } from './entities/expense.entity';
import { Finance } from './entities/finance.entity';
import { type Group } from './entities/group.entity';
import { type Income } from './entities/incomes.entity';
import { type Month } from './entities/month.entity';
import { type Supplier } from './entities/supplier.entity';
import { type SupplierType } from './entities/type.entity';
import { type User } from '../auth/entities/user.entity';

import { BankService } from './bank/bank.service';
import { BillService } from './bill/bill.service';
import { FinanceService } from './finance.service';
import { GroupService } from './group/group.service';
import { IncomeService } from './income/income.service';
import { type IncomeSource } from './entities/income-source.entity';
import { SupplierService } from './supplier/supplier.service';

jest.mock('../shared', () => {
    class ServiceMock {
        save = jest.fn();
        findOne = jest.fn();
        seeder = {
            entities: jest.fn(),
            executeSeed: jest.fn(),
            currentSeeds: jest.fn(),
        };
    }

    return { Service: ServiceMock }
});

jest.mock('./bank/bank.service', () => {
    class BankServiceMock {
        seeds = jest.fn();
    }

    return { BankService: BankServiceMock }
});

jest.mock('./group/group.service', () => {
    class GroupServiceMock {
        seeds = jest.fn();
    }

    return { GroupService: GroupServiceMock }
});


jest.mock('./supplier/supplier.service', () => {
    class SupplierServiceMock {
        seeds = jest.fn();
    }

    return { SupplierService: SupplierServiceMock }
});


jest.mock('./bill/bill.service', () => {
    class BillServiceMock {
        seeds = jest.fn();
        expense = {
            seeds: jest.fn(),
        };
        spreadsheetProcessing = jest.fn();
        initializeBySpreadsheet = jest.fn();
    }

    return { BillService: BillServiceMock }
});

jest.mock('./income/income.service', () => {
    class IncomeServiceMock {
        seeds = jest.fn();
        findAll = jest.fn();
        source = {
            findAll: jest.fn(),
        };
    }

    return { IncomeService: IncomeServiceMock }
});


describe('FinanceService', () => {
    let repository: Repository<Finance>;
    let service: FinanceService;
    let bankService: BankService;
    let groupService: GroupService;
    let supplierService: SupplierService;
    let billService: BillService;
    let incomeService: IncomeService;

    const mockEntity: Finance = FINANCE_MOCK;
    const bankMockEntity: Bank = BANK_MOCK;
    const groupMockEntity: Group = GROUP_MOCK;
    const supplierMockEntity: Supplier = SUPPLIER_MOCK;
    const supplierTypeMockEntity: SupplierType = SUPPLIER_TYPE_MOCK;
    const billMockEntity: Bill = BILL_MOCK;
    const expenseMockEntity: Expense = EXPENSE_MOCK;
    const mockUser: User = USER_MOCK;
    const mockIncome: Income = { ...INCOME_MOCK, months: [INCOME_MONTH_MOCK as unknown as Month] };
    const mockIncomeSource: IncomeSource = INCOME_SOURCE_MOCK;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FinanceService,
                { provide: getRepositoryToken(Finance), useClass: Repository },
                { provide: BankService, useValue: { seeds: jest.fn(), findAll: jest.fn() } },
                { provide: GroupService, useValue: { seeds: jest.fn(), findAll: jest.fn() } },
                { provide: SupplierService, useValue: { seeds: jest.fn(), findAll: jest.fn(), type: { findAll: jest.fn() } } },
                { provide: IncomeService, useValue: { seeds: jest.fn(), findAll: jest.fn(), source: { findAll: jest.fn() } } },
                {
                    provide: BillService,
                    useValue: {
                        seeds: jest.fn(),
                        findAll: jest.fn(),
                        expense: {
                            seeds: jest.fn(),
                            business: {
                                calculateAll: jest.fn()
                            }
                        },
                        spreadsheetProcessing: jest.fn(),
                        initializeBySpreadsheet: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get<Repository<Finance>>(getRepositoryToken(Finance));
        billService = module.get<BillService>(BillService);
        bankService = module.get<BankService>(BankService);
        groupService = module.get<GroupService>(GroupService);
        supplierService = module.get<SupplierService>(SupplierService);
        incomeService = module.get<IncomeService>(IncomeService);
        service = module.get<FinanceService>(FinanceService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
        expect(bankService).toBeDefined();
        expect(groupService).toBeDefined();
        expect(supplierService).toBeDefined();
        expect(billService).toBeDefined();
        expect(service).toBeDefined();
    });

    describe('initialize', () => {
        it('should return existing finance if it already exists', async () => {
            const result = await service.initialize(mockUser);
            expect(result).toEqual({
                ...mockEntity,
                user: mockUser,
            });
        });

        it('should create a new finance if it does not exist', async () => {
            jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
            expect(await service.initialize(mockEntity.user)).toEqual(
                mockEntity,
            );
        });
    });

    describe('generateDocument', () => {
        it('Should generate a document successfully', async () => {
            jest.spyOn(service, 'validateFinance' as any).mockResolvedValueOnce(mockEntity);
            jest.spyOn(service, 'fetchGroups' as any).mockResolvedValueOnce([groupMockEntity]);
            jest.spyOn(billService, 'spreadsheetProcessing').mockImplementation(async () => undefined);
            spreadsheetMock.generateSheetBuffer.mockImplementation(async () => Buffer.from('mock-buffer'));
            const result = await service.generateDocument(USER_MOCK, 2025);
            expect(result).toEqual(Buffer.from('mock-buffer'));
        });
    });

    describe('seeds', () => {
        it('should run all seeds and return list of total seeds', async () => {
            jest.spyOn(service, 'seed' as any).mockResolvedValueOnce([mockEntity]);

            jest.spyOn(service.seeder, 'executeSeed').mockImplementation(async ({ seedMethod }: any) => {
                seedMethod(bankMockEntity);
                return [bankMockEntity];
            });
            jest.spyOn(bankService, 'seeds').mockResolvedValueOnce([bankMockEntity]);

            jest.spyOn(supplierService, 'seeds').mockResolvedValueOnce({
                supplierList: [supplierMockEntity],
                supplierTypeList: [supplierTypeMockEntity]
            });

            jest.spyOn(service.seeder, 'executeSeed').mockImplementation(async ({ seedMethod }: any) => {
                seedMethod(groupMockEntity);
                return [groupMockEntity];
            });
            jest.spyOn(groupService, 'seeds').mockResolvedValueOnce([groupMockEntity]);

            jest.spyOn(service.seeder, 'currentSeeds').mockReturnValue([mockEntity]);

            jest.spyOn(service.seeder, 'executeSeed').mockImplementation(async ({ seedMethod }: any) => {
                seedMethod(billMockEntity);
                return [billMockEntity];
            });
            jest.spyOn(billService, 'seeds').mockResolvedValueOnce([billMockEntity]);

            jest.spyOn(service.seeder, 'executeSeed').mockImplementation(async ({ seedMethod }: any) => {
                seedMethod(expenseMockEntity);
                return [expenseMockEntity];
            });
            jest.spyOn(billService.expense, 'seeds').mockResolvedValueOnce([expenseMockEntity]);

            jest.spyOn(incomeService, 'seeds').mockResolvedValueOnce({
                incomeList: [mockIncome],
                incomeSourceList: [mockIncomeSource]
            });

            const result = await service.seeds({
                users: [mockUser],
                billListJson: [billMockEntity],
                bankListJson: [bankMockEntity],
                groupListJson: [groupMockEntity],
                financeListJson: [mockEntity],
                expenseListJson: [expenseMockEntity],
                supplierListJson: [supplierMockEntity],
                supplierTypeListJson: [supplierTypeMockEntity]
            });

            expect(result.bills.length).toEqual(1);
            expect(result.groups.length).toEqual(1);
            expect(result.banks.length).toEqual(1);
            expect(result.expenses.length).toEqual(1);
            expect(result.finances.length).toEqual(1);
            expect(result.suppliers.length).toEqual(1);
            expect(result.supplierTypes.length).toEqual(1);
            expect(result.incomes.length).toEqual(1);
            expect(result.incomeSources.length).toEqual(1);
        });

        it('should run all seeds and return list of total seeds with some seeds empty', async () => {
            jest.spyOn(service, 'seed' as any).mockResolvedValueOnce([mockEntity]);

            jest.spyOn(service.seeder, 'executeSeed').mockImplementation(async ({ seedMethod }: any) => {
                seedMethod();
                return [];
            });
            jest.spyOn(bankService, 'seeds').mockResolvedValueOnce({ message: 'Successfully' });


            jest.spyOn(supplierService, 'seeds').mockResolvedValueOnce({
                supplierList: [supplierMockEntity],
                supplierTypeList: [supplierTypeMockEntity]
            });

            jest.spyOn(groupService, 'seeds').mockResolvedValueOnce({ message: 'Successfully' });

            jest.spyOn(service.seeder, 'currentSeeds').mockReturnValue([mockEntity]);

            jest.spyOn(billService, 'seeds').mockResolvedValueOnce({ message: 'Successfully' });

            jest.spyOn(billService.expense, 'seeds').mockResolvedValueOnce([expenseMockEntity]);

            jest.spyOn(incomeService, 'seeds').mockResolvedValueOnce({
                incomeList: [mockIncome],
                incomeSourceList: [mockIncomeSource]
            });

            const result = await service.seeds({
                users: [mockUser],
                billListJson: [billMockEntity],
                bankListJson: [bankMockEntity],
                groupListJson: [groupMockEntity],
                financeListJson: [mockEntity],
                expenseListJson: [expenseMockEntity],
                supplierListJson: [supplierMockEntity],
                supplierTypeListJson: [supplierTypeMockEntity]
            });

            expect(result.bills.length).toEqual(0);
            expect(result.groups.length).toEqual(0);
            expect(result.banks.length).toEqual(0);
            expect(result.expenses.length).toEqual(0);
            expect(result.finances.length).toEqual(1);
            expect(result.suppliers.length).toEqual(1);
            expect(result.supplierTypes.length).toEqual(1);
            expect(result.incomes.length).toEqual(1);
            expect(result.incomeSources.length).toEqual(1);
        });

        it('should run all seeds and return list of total seeds empty', async () => {
            const financeMockEntity = {
                ...mockEntity,
                user: {
                    ...mockEntity.user,
                    cpf: '10482980001',
                }
            }
            jest.spyOn(service, 'seed' as any).mockResolvedValueOnce([]);

            jest.spyOn(service.seeder, 'executeSeed').mockImplementation(async ({ seedMethod }: any) => {
                seedMethod();
                return [];
            });

            jest.spyOn(bankService, 'seeds').mockResolvedValueOnce({ message: 'Successfully' });

            jest.spyOn(supplierService, 'seeds').mockResolvedValueOnce({
                supplierList: [supplierMockEntity],
                supplierTypeList: [supplierTypeMockEntity]
            });

            jest.spyOn(groupService, 'seeds').mockResolvedValueOnce({ message: 'Successfully' });

            jest.spyOn(service.seeder, 'currentSeeds').mockReturnValue([]);

            jest.spyOn(billService, 'seeds').mockResolvedValueOnce({ message: 'Successfully' });

            jest.spyOn(billService.expense, 'seeds').mockResolvedValueOnce([]);

            jest.spyOn(incomeService, 'seeds').mockResolvedValueOnce({
                incomeList: [],
                incomeSourceList: []
            });

            const result = await service.seeds({
                users: [mockUser],
                billListJson: [billMockEntity],
                bankListJson: [bankMockEntity],
                groupListJson: [groupMockEntity],
                financeListJson: [financeMockEntity],
                expenseListJson: [expenseMockEntity],
                supplierListJson: [supplierMockEntity],
                supplierTypeListJson: [supplierTypeMockEntity]
            });

            expect(result.bills.length).toEqual(0);
            expect(result.groups.length).toEqual(0);
            expect(result.banks.length).toEqual(0);
            expect(result.expenses.length).toEqual(0);
            expect(result.finances.length).toEqual(0);
            expect(result.suppliers.length).toEqual(1);
            expect(result.supplierTypes.length).toEqual(1);
            expect(result.incomes.length).toEqual(0);
            expect(result.incomeSources.length).toEqual(0);
        });
    });

    describe('initializeWithDocument', () => {
        const mockedStream = new Readable();
        mockedStream.push('mock stream content');
        mockedStream.push(null);
        const mockFile: Express.Multer.File = {
            fieldname: 'file',
            originalname: 'test-image.jpeg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            size: 1024,
            buffer: Buffer.from('mock file content'),
            destination: 'uploads/',
            filename: 'test-image.jpeg',
            path: 'uploads/test-image.jpeg',
            stream: mockedStream,
        };
        it('Should return trow error when dont have file', async () => {
            await expect(
                service.initializeWithDocument({ ...mockFile, buffer: undefined } as any, mockUser)
            ).rejects.toThrowError(ConflictException);
        });

        it('Should initialize finance with document successfully', async () => {
            jest.spyOn(service, 'initialize').mockResolvedValueOnce(mockEntity);

            jest.spyOn(billService, 'initializeBySpreadsheet').mockResolvedValueOnce([{
                groupName: '',
                bills: 1,
                expenses: 1,
            }]);
            const result = await service.initializeWithDocument(mockFile, mockUser);
            expect(result).toHaveLength(1);
        });
    });

    describe('getByUser', () => {
        it('should return finance entities by user successfully', async () => {
            const mockFinance = { ...mockEntity, groups: [groupMockEntity] };
            jest.spyOn(service,'validateFinance' as any).mockReturnValue(mockFinance);
            jest.spyOn(service,'findOne').mockResolvedValueOnce(mockFinance);
            jest.spyOn(service, 'fetchBills' as any).mockResolvedValueOnce([billMockEntity]);
            jest.spyOn(billService.expense.business, 'calculateAll' as any).mockReturnValue({
                total: 1000,
                allPaid: true,
                totalPaid: 500,
                totalPending: 500
            });
            jest.spyOn(bankService, 'findAll' as any).mockResolvedValueOnce([bankMockEntity]);
            jest.spyOn(supplierService, 'findAll' as any).mockResolvedValueOnce([supplierMockEntity]);
            jest.spyOn(supplierService.type, 'findAll' as any).mockResolvedValueOnce([supplierTypeMockEntity]);
            jest.spyOn(incomeService, 'findAll' as any).mockResolvedValueOnce([mockIncome]);
            jest.spyOn(incomeService.source, 'findAll' as any).mockResolvedValueOnce([mockIncomeSource]);
            const result = await service.getByUser(mockUser);
            expect(result.finance).toEqual(mockFinance);
            expect(result.groups).toEqual([groupMockEntity]);
            expect(result.bills).toEqual([billMockEntity]);
            expect(result.banks).toEqual([bankMockEntity]);
            expect(result.suppliers).toEqual([supplierMockEntity]);
            expect(result.supplierTypes).toEqual([supplierTypeMockEntity]);
            expect(result.expenses).toEqual(billMockEntity.expenses);
            expect(result.incomes).toEqual([mockIncome]);
            expect(result.incomeSources).toEqual([mockIncomeSource]);
        });
    });

    describe('privates', () => {
        describe('validateFinance', () => {
            it('should return throw error when user dont has finance.', () => {
                expect(() => service['validateFinance']({
                    ...mockUser,
                    finance: undefined
                })).toThrow(NotFoundException);
            });

            it('should return finance when user has finance.', () => {
                expect(service['validateFinance'](mockUser)).toEqual(mockUser.finance);
            });
        });

        describe('fetchGroups', () => {
            it('should return a list of groups successfully', async () => {
                jest.spyOn(groupService, 'findAll').mockResolvedValueOnce([groupMockEntity]);
                const result = await service['fetchGroups'](mockEntity.id);
                expect(result).toEqual([groupMockEntity]);
            });
        });

        describe('seed', () => {
            it('Should return seed of finance successfully', async () => {
                jest.spyOn(service.seeder, 'entities').mockImplementation(async ({ createdEntityFn }: any) => {
                    createdEntityFn(mockEntity);
                    return [mockEntity];
                });
                expect(await service['seed']([mockEntity], [mockUser])).toEqual([mockEntity]);
            });

            it('Should return empty when user in finance is different.', async () => {
                jest.spyOn(service.seeder, 'entities').mockImplementation(async ({ createdEntityFn }: any) => {
                    createdEntityFn(mockEntity);
                    return [];
                });
                expect(await service['seed']([mockEntity], [{ ...mockUser, cpf: '12345678912' }])).toEqual([]);
            });
        });

        describe('fetchBills', () => {
            it('should return a list of bills by finance successfully', async () => {
                jest.spyOn(billService, 'findAll').mockResolvedValueOnce([billMockEntity]);
                const result = await service['fetchBills'](mockEntity.id);
                expect(result).toEqual([billMockEntity]);
            });
        });
    });
});
