import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { INCOME_MOCK, INCOME_MONTH_MOCK } from '../mocks/income.mock';
import { BANK_MOCK } from '../mocks/bank.mock';
import { BILL_MOCK } from '../mocks/bill.mock';
import { EXPENSE_MOCK, EXPENSE_MONTH_MOCK } from '../mocks/expense.mock';
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
import { FinanceGenerateSeeds, FinanceService } from './finance.service';
import { GroupService } from './group/group.service';
import { IncomeService } from './income/income.service';
import { type IncomeSource } from './entities/income-source.entity';
import { SupplierService } from './supplier/supplier.service';
import { MonthService } from './month/month.service';
import type { CreateFinanceSeedsDto } from './dto/create-finance-seeds.dto';
import type { FinanceSeedsResult } from './types';
import { NotFoundException } from '@nestjs/common';

jest.mock('../shared', () => {
    class ServiceMock {
        save = jest.fn();
        findOne = jest.fn();
        file = {
            createDirectory: jest.fn(),
            getSeedsDirectory: jest.fn(),
        };
        generateEntitySeeds = jest.fn();
        seeder = {
            entities: jest.fn(),
            executeSeed: jest.fn(),
            currentSeeds: jest.fn(),
            persistEntity: jest.fn(),
            generateEntity: jest.fn(),
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
    let monthService: MonthService;

    const mockEntity: Finance = FINANCE_MOCK;
    const mockBankEntity: Bank = BANK_MOCK;
    const mockGroupEntity: Group = GROUP_MOCK;
    const mockSupplierEntity: Supplier = SUPPLIER_MOCK;
    const mockSupplierTypeEntity: SupplierType = SUPPLIER_TYPE_MOCK;
    const mockBillEntity: Bill = BILL_MOCK;
    const mockExpenseMonthEntity: Month = EXPENSE_MONTH_MOCK as unknown as Month;
    const mockExpenseEntity: Expense = { ...EXPENSE_MOCK, months: [mockExpenseMonthEntity] };
    const mockUser: User = USER_MOCK;
    const mockIncomeMonthEntity: Month = INCOME_MONTH_MOCK as unknown as Month;
    const mockIncome: Income = { ...INCOME_MOCK, months: [mockIncomeMonthEntity] };
    const mockIncomeSource: IncomeSource = INCOME_SOURCE_MOCK;

    const createFinanceSeedsDto: CreateFinanceSeedsDto = {
        bank: true,
        bill: true,
        group: true,
        expense: true,
        supplier: true,
        finance: true,
        income: true,
        incomeSource: true,
        supplierType: true,
    };
    const financeGenerateSeeds: FinanceGenerateSeeds = {
        banks: { list: [mockBankEntity], added: [mockBankEntity] },
        bills: { list: [mockBillEntity], added: [mockBillEntity] },
        groups: { list: [mockGroupEntity], added: [mockGroupEntity] },
        months: { list: [mockExpenseMonthEntity, mockIncomeMonthEntity], added: [mockExpenseMonthEntity, mockIncomeMonthEntity] },
        incomes: { list: [mockIncome], added: [mockIncome] },
        expenses: { list: [mockExpenseEntity], added: [mockExpenseEntity] },
        finances: { list: [mockEntity], added: [mockEntity] },
        suppliers: { list: [mockSupplierEntity], added: [mockSupplierEntity] },
        incomeSources: { list: [mockIncomeSource], added: [mockIncomeSource] },
        supplierTypes: { list: [mockSupplierTypeEntity], added: [mockSupplierTypeEntity] },
    }
    const financeSeedsResult: FinanceSeedsResult = {
        bank: { list: 1, added: 1 },
        bill: { list: 1, added: 1 },
        group: { list: 1, added: 1 },
        months: { list: 2, added: 2 },
        income: { list: 1, added: 1 },
        expense: { list: 1, added: 1 },
        finance: { list: 1, added: 1 },
        supplier: { list: 1, added: 1 },
        incomeSource: { list: 1, added: 1 },
        supplierType: { list: 1, added: 1 },
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FinanceService,
                { provide: getRepositoryToken(Finance), useClass: Repository },
                {
                    provide: BankService,
                    useValue: {
                        findAll: jest.fn(),
                        persistSeeds: jest.fn(),
                        generateSeeds: jest.fn(),
                    }
                },
                {
                    provide: MonthService,
                    useValue: {
                        persistSeeds: jest.fn(),
                        generateSeeds: jest.fn()
                    }
                },
                {
                    provide: GroupService,
                    useValue: {
                        findAll: jest.fn(),
                        generateSeeds: jest.fn(),
                        persistSeeds: jest.fn()
                    }
                },
                {
                    provide: SupplierService,
                    useValue: {
                        generateSeeds: jest.fn(),
                        persistSeeds: jest.fn(),
                        findAll: jest.fn(),
                        type: {
                            findAll: jest.fn()
                        }
                    }
                },
                {
                    provide: IncomeService,
                    useValue: {
                        generateSeeds: jest.fn(),
                        persistSeeds: jest.fn(),
                        findAll: jest.fn(),
                        source: { findAll: jest.fn() }
                    }
                },
                {
                    provide: BillService,
                    useValue: {
                        findAll: jest.fn(),
                        expense: {
                            business: {
                                calculateAll: jest.fn()
                            }
                        },
                        generateSeeds: jest.fn(),
                        persistSeeds: jest.fn(),
                        spreadsheetProcessing: jest.fn(),
                        initializeBySpreadsheet: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get<Repository<Finance>>(getRepositoryToken(Finance));
        billService = module.get<BillService>(BillService);
        bankService = module.get<BankService>(BankService);
        monthService = module.get<MonthService>(MonthService);
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

    describe('create', () => {
        it('should return existing finance if it already exists', async () => {
            const result = await service.create(mockUser);
            expect(result).toEqual({
                ...mockEntity,
                user: mockUser,
            });
        });

        it('should create a new finance if it does not exist', async () => {
            jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
            expect(await service.create(mockEntity.user)).toEqual(
                mockEntity,
            );
        });
    });

    describe('getByUser', () => {
        it('should return finance entities by user successfully', async () => {
            const mockFinance = { ...mockEntity, groups: [mockGroupEntity] };
            jest.spyOn(service,'validateFinance' as any).mockReturnValue(mockFinance);
            jest.spyOn(service,'findOne').mockResolvedValueOnce(mockFinance);
            jest.spyOn(billService, 'findAll').mockResolvedValueOnce([mockBillEntity]);
            jest.spyOn(billService.expense.business, 'calculateAll' as any).mockReturnValue({
                total: 1000,
                allPaid: true,
                totalPaid: 500,
                totalPending: 500
            });
            jest.spyOn(bankService, 'findAll' as any).mockResolvedValueOnce([mockBankEntity]);
            jest.spyOn(supplierService, 'findAll' as any).mockResolvedValueOnce([mockSupplierEntity]);
            jest.spyOn(supplierService.type, 'findAll' as any).mockResolvedValueOnce([mockSupplierTypeEntity]);
            jest.spyOn(incomeService, 'findAll' as any).mockResolvedValueOnce([mockIncome]);
            jest.spyOn(incomeService.source, 'findAll' as any).mockResolvedValueOnce([mockIncomeSource]);
            const result = await service.getByUser(mockUser);
            expect(result.finance).toEqual(mockFinance);
            expect(result.groups).toEqual([mockGroupEntity]);
            expect(result.bills).toEqual([mockBillEntity]);
            expect(result.banks).toEqual([mockBankEntity]);
            expect(result.suppliers).toEqual([mockSupplierEntity]);
            expect(result.supplierTypes).toEqual([mockSupplierTypeEntity]);
            expect(result.expenses).toEqual(mockBillEntity.expenses);
            expect(result.incomes).toEqual([mockIncome]);
            expect(result.incomeSources).toEqual([mockIncomeSource]);
        });

        it('should return finance entities by user with groups empty', async () => {
            const mockFinance = { ...mockEntity, groups: undefined };
            jest.spyOn(service,'validateFinance' as any).mockReturnValue(mockFinance);
            jest.spyOn(service,'findOne').mockResolvedValueOnce(mockFinance);
            jest.spyOn(billService, 'findAll').mockResolvedValueOnce([mockBillEntity]);
            jest.spyOn(billService.expense.business, 'calculateAll' as any).mockReturnValue({
                total: 1000,
                allPaid: true,
                totalPaid: 500,
                totalPending: 500
            });
            jest.spyOn(bankService, 'findAll' as any).mockResolvedValueOnce([mockBankEntity]);
            jest.spyOn(supplierService, 'findAll' as any).mockResolvedValueOnce([mockSupplierEntity]);
            jest.spyOn(supplierService.type, 'findAll' as any).mockResolvedValueOnce([mockSupplierTypeEntity]);
            jest.spyOn(incomeService, 'findAll' as any).mockResolvedValueOnce([mockIncome]);
            jest.spyOn(incomeService.source, 'findAll' as any).mockResolvedValueOnce([mockIncomeSource]);
            const result = await service.getByUser(mockUser);
            expect(result.finance).toEqual(mockFinance);
            expect(result.groups).toEqual([]);
            expect(result.bills).toEqual([mockBillEntity]);
            expect(result.banks).toEqual([mockBankEntity]);
            expect(result.suppliers).toEqual([mockSupplierEntity]);
            expect(result.supplierTypes).toEqual([mockSupplierTypeEntity]);
            expect(result.expenses).toEqual(mockBillEntity.expenses);
            expect(result.incomes).toEqual([mockIncome]);
            expect(result.incomeSources).toEqual([mockIncomeSource]);
        });
    });

    describe('generateSeeds', () => {
        it('should generate seeds successfully', async () => {
            jest.spyOn(service, 'validateFinanceSeedsDto' as any).mockResolvedValueOnce(createFinanceSeedsDto);
            jest.spyOn(service.file, 'getSeedsDirectory').mockReturnValue('dir');
            jest.spyOn(service.file, 'createDirectory').mockReturnValue('dir/finance');
            jest.spyOn(bankService, 'generateSeeds').mockResolvedValueOnce(financeGenerateSeeds.banks);
            jest.spyOn(supplierService, 'generateSeeds').mockResolvedValueOnce({
                suppliers: financeGenerateSeeds.suppliers,
                supplierTypes: financeGenerateSeeds.supplierTypes
            });
            jest.spyOn(service, 'generateEntitySeeds').mockResolvedValueOnce(financeGenerateSeeds.finances);
            jest.spyOn(incomeService, 'generateSeeds').mockResolvedValueOnce({
                months: [mockIncomeMonthEntity],
                incomes: financeGenerateSeeds.incomes,
                incomeSources: financeGenerateSeeds.incomeSources
            });
            jest.spyOn(groupService, 'generateSeeds').mockResolvedValueOnce(financeGenerateSeeds.groups);

            jest.spyOn(billService, 'generateSeeds').mockResolvedValueOnce({
                bills: financeGenerateSeeds.bills,
                months: [mockIncomeMonthEntity],
                expenses: financeGenerateSeeds.expenses,
            });
            jest.spyOn(monthService, 'generateSeeds').mockResolvedValueOnce(financeGenerateSeeds.months);
            jest.spyOn(service, 'mapperFinanceSeedsResult' as any).mockResolvedValueOnce(financeSeedsResult);

            const result = await service.generateSeeds(createFinanceSeedsDto);
            expect(result.bank).toEqual(financeSeedsResult.bank);
            expect(result.supplier).toEqual(financeSeedsResult.supplier);
            expect(result.supplierType).toEqual(financeSeedsResult.supplierType);
            expect(result.income).toEqual(financeSeedsResult.income);
            expect(result.incomeSource).toEqual(financeSeedsResult.incomeSource);
            expect(result.group).toEqual(financeSeedsResult.group);
            expect(result.bill).toEqual(financeSeedsResult.bill);
            expect(result.months).toEqual(financeSeedsResult.months);
            expect(result.finance).toEqual(financeSeedsResult.finance);

        })
    });

    describe('persistSeeds', () => {
        it('should persist seeds successfully', async () => {
            jest.spyOn(service, 'validateFinanceSeedsDto' as any).mockResolvedValueOnce(createFinanceSeedsDto);
            jest.spyOn(bankService, 'persistSeeds').mockResolvedValueOnce(financeGenerateSeeds.banks);
            jest.spyOn(supplierService, 'persistSeeds').mockResolvedValueOnce({
                suppliers: financeGenerateSeeds.suppliers,
                supplierTypes: financeGenerateSeeds.supplierTypes
            });
            jest.spyOn(service.seeder, 'persistEntity').mockResolvedValueOnce(financeGenerateSeeds.finances);
            jest.spyOn(incomeService, 'persistSeeds').mockResolvedValueOnce({
                months: [mockIncomeMonthEntity],
                incomes: financeGenerateSeeds.incomes,
                incomeSources: financeGenerateSeeds.incomeSources
            });
            jest.spyOn(groupService, 'persistSeeds').mockResolvedValueOnce(financeGenerateSeeds.groups);

            jest.spyOn(billService, 'persistSeeds').mockResolvedValueOnce({
                bills: financeGenerateSeeds.bills,
                months: [mockIncomeMonthEntity],
                expenses: financeGenerateSeeds.expenses,
            });
            jest.spyOn(monthService, 'persistSeeds').mockResolvedValueOnce(financeGenerateSeeds.months);
            jest.spyOn(service, 'mapperFinanceSeedsResult' as any).mockResolvedValueOnce(financeSeedsResult);

            const result = await service.persistSeeds(createFinanceSeedsDto);
            expect(result.bank).toEqual(financeSeedsResult.bank);
            expect(result.supplier).toEqual(financeSeedsResult.supplier);
            expect(result.supplierType).toEqual(financeSeedsResult.supplierType);
            expect(result.income).toEqual(financeSeedsResult.income);
            expect(result.incomeSource).toEqual(financeSeedsResult.incomeSource);
            expect(result.group).toEqual(financeSeedsResult.group);
            expect(result.bill).toEqual(financeSeedsResult.bill);
            expect(result.months).toEqual(financeSeedsResult.months);
            expect(result.finance).toEqual(financeSeedsResult.finance);

        })
    });

    describe('privates', () => {
        describe('mapperFinanceSeedsResult', () => {
            it('should map seeds result', () => {
                const result = service['mapperFinanceSeedsResult'](financeGenerateSeeds);
                expect(result).toEqual(financeSeedsResult);
            });
        });

        describe('validateFinanceSeedsDto', () => {
            it('should validate seeds dto', () => {
                const result = service['validateFinanceSeedsDto'](createFinanceSeedsDto);
                expect(result).toEqual(createFinanceSeedsDto);
            });
        });
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
    });
});
