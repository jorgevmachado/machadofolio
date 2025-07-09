import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { type CycleOfMonths, MONTHS } from '@repo/services/date/month/month';
import { Spreadsheet } from '@repo/services/spreadsheet/spreadsheet';

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
import { type CreateBillDto } from './dto/create-bill.dto';
import { ExpenseService } from './expense/expense.service';
import { GroupService } from '../group/group.service';

import { ConflictException, NotFoundException } from '@nestjs/common';
import { type UpdateBillDto } from './dto/update-bill.dto';
import { type UpdateExpenseDto } from './expense/dto/update-expense.dto';

jest.mock('@repo/services/spreadsheet/spreadsheet');

describe('BillService', () => {
    let service: BillService;
    let business: BillBusiness;
    let bankService: BankService;
    let groupService: GroupService;
    let expenseService: ExpenseService;
    let repository: Repository<Bill>;
    let spreadsheetMock: jest.Mocked<Spreadsheet>;

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
                        buildForUpdate: jest.fn(),
                        addExpenseForNextYear: jest.fn(),
                        treatEntitiesParams: jest.fn(),
                        findAll: jest.fn(),
                        seeds: jest.fn(),
                        softRemove: jest.fn(),
                        supplierSeeds: jest.fn(),
                        getExpensesFromSheet: jest.fn(),
                        business: {
                            allHaveBeenPaid: jest.fn(),
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
        spreadsheetMock = {
            loadFile: jest.fn(),
            addTable: jest.fn().mockImplementation(() => {
                return { nextRow: 1 };
            }),
            addTables: jest.fn().mockImplementation(() => {
                return { nextRow: 1 };
            }),
            workSheet: {
                cell: jest.fn(),
                addCell: jest.fn(),
            },
            createWorkSheet: jest.fn(),
            updateWorkSheet: jest.fn(),
            calculateTableHeight: jest.fn(({ total }) => total || 0),
            calculateTablesParamsNextRow: jest.fn(({ startRow = 0, totalTables = 0, linesPerTable = 0 }) => (
                startRow + (totalTables * (linesPerTable + 1))
            )),
            parseExcelRowsToObjectList: jest.fn(),
        } as unknown as jest.Mocked<Spreadsheet>;
        (Spreadsheet as unknown as jest.Mock).mockImplementation(() => spreadsheetMock);
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
                group: mockEntity.group.name,
            };
            jest
                .spyOn(bankService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.bank);

            jest
                .spyOn(groupService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.group);

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
                group: mockEntity.group.name,
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
                .spyOn(groupService, 'treatEntityParam')
                .mockResolvedValueOnce(mockEntity.group);

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

            jest.spyOn(groupService, 'seeds').mockResolvedValueOnce([mockEntity.group]);

            jest.spyOn(repository, 'find').mockResolvedValueOnce([mockEntity]);

            expect(await service.seeds({
                banks: [mockEntity.bank],
                groups: [mockEntity.group],
                finance: financeMockEntity,
                billListJson: [mockEntity],
            })).toEqual([mockEntity]);
        });

        it('should seed the database when not exist in database', async () => {
            const financeMock = {
                ...financeMockEntity,
                bills: [mockEntity]
            }
            jest.spyOn(bankService, 'seeds').mockResolvedValueOnce([mockEntity.bank]);

            jest.spyOn(groupService, 'seeds').mockResolvedValueOnce([mockEntity.group]);

            jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);
            expect(await service.seeds({
                banks: [mockEntity.bank],
                groups: [mockEntity.group],
                finance: financeMock,
                billListJson: [mockEntity],
            })).toEqual([mockEntity]);
        });

        it('Should return a seed empty when received a empty list', async () => {
            jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
            expect(await service.seeds({
                banks: [mockEntity.bank],
                groups: [mockEntity.group],
                finance: financeMockEntity,
            })).toEqual([]);
        });
    });

    describe('billExpenseService', () => {
        it('Should return the expense service instance', () => {
            const result = service.expense;

            expect(result).toBeDefined();
            expect(result).toBe(expenseService);
        });
    });

    describe('spreadsheetProcessing', () => {
        const bills = [mockEntity, mockEntity];
        const params = {
            year: 2025,
            groupId: 'grp1',
            sheet: spreadsheetMock,
            startRow: 14,
            groupName: 'grp1',
            tableWidth: 3,
            groupsName: [],
            startColumn: 2,
        }
        it('must search for the bills of the group/year informed and delegate the processing.', async () => {
            const findAllByGroupYearMock = jest
                .spyOn(service as any, 'findAllByGroupYear')
                .mockResolvedValue(bills);

            await service.spreadsheetProcessing(params);

            expect(findAllByGroupYearMock).toHaveBeenCalledWith('grp1', 2025);
            expect(business.spreadsheetProcessing).toHaveBeenCalled();
        });

        it('must use the current year if not provided.', async () => {
            const mockDate = new Date(2023, 6, 1);
            jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);
            jest.spyOn(service as any, 'findAllByGroupYear').mockResolvedValue(bills);

            await service.spreadsheetProcessing({...params, year: undefined });

            expect(business.spreadsheetProcessing).toHaveBeenCalled();
        });

        it('must pass empty array if findAllByGroupYear returns empty.', async () => {
            jest.spyOn(service as any, 'findAllByGroupYear').mockResolvedValue([]);

            await service.spreadsheetProcessing(params);

            expect(business.spreadsheetProcessing).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: [],
                })
            );
        });
    });

    describe('initializeBySpreadsheet', () => {
        const fakeBuffer = Buffer.from('anything') as Buffer;
        it('Should return an error for not finding worksheet.', async () => {
            spreadsheetMock.loadFile.mockReturnValueOnce([undefined] as any);
            await expect(service.initializeBySpreadsheet(fakeBuffer, financeMockEntity)).rejects.toThrow(ConflictException);
        });

        it('must initialize the database through a spreadsheet.', async () => {
            spreadsheetMock.loadFile.mockReturnValueOnce([spreadsheetMock.workSheet] as any);
            jest.spyOn(service, 'initializeWithWorksheet' as any).mockResolvedValueOnce({
                bills: [mockEntity],
                expenses: [expenseMockEntity],
                groupName: 'Personal',
            })
            const result = await service.initializeBySpreadsheet(fakeBuffer, financeMockEntity);
            expect(result).toEqual([{
                bills: 1,
                expenses: 1,
                groupName: 'Personal',
            }]);
        });
    });

    describe('privates', () => {
        describe('findAllByGroupYear', () => {
            it('should return the found bills (array).', async () => {
                const billsMock = [mockEntity, mockEntity];

                const findAllSpy = jest.spyOn(service, 'findAll').mockResolvedValue(billsMock as any);

                const result = await service['findAllByGroupYear']('grupo-xy', 2021);

                expect(findAllSpy).toHaveBeenCalledWith({
                    filters: [
                        { value: 'grupo-xy', param: 'group', condition: '=' },
                        { value: 2021, param: 'year', condition: '=' },
                    ],
                    withRelations: true,
                });
                expect(result).toBe(billsMock);
            });

            it('should return empty array if findAll does not return an array.', async () => {
                jest.spyOn(service, 'findAll').mockResolvedValue(undefined as any);

                const result = await service['findAllByGroupYear']('some-group', 2023);

                expect(result).toEqual([]);
            });

            it('should return empty array if findAll returns null.', async () => {
                jest.spyOn(service, 'findAll').mockResolvedValue(null as any);

                const result = await service['findAllByGroupYear']('xpto', 2000);
                expect(result).toEqual([]);
            });
        });

        describe('createToSheet', () => {

            const params = {
                ...monthsObj,
                year: '2025',
                type: 'PIX',
                group: 'Personal',
                bank: 'Nubank',
                finance: financeMockEntity
            }
            it('It should return a bill when found in the database and should not save.', async () => {
                const findOneSpy = jest.spyOn(service, 'findOne').mockResolvedValue(mockEntity);
                const result = await service['createToSheet'](params);

                expect(findOneSpy).toHaveBeenCalledWith({
                    value: 'Personal Pix',
                    filters: [{ value: 2025, param: 'year', condition: '=' }],
                    withThrow: false,
                    withDeleted: true,
                })

                expect(result).toEqual(mockEntity);
            });

            it('A new bill must persist in the database.', async () => {
                jest.spyOn(service, 'findOne').mockResolvedValue(null);

                jest.spyOn(bankService, 'createToSheet').mockResolvedValue(mockEntity.bank);
                jest.spyOn(groupService, 'createToSheet').mockResolvedValue(mockEntity.group);
                jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);
                const result = await service['createToSheet']({...params, type: 'CREDIT_CARD'});

                expect(result).toEqual(mockEntity);
            });

            it('Should return error when unable to save bank.', async () => {
                jest.spyOn(service, 'findOne').mockResolvedValue(null);

                jest.spyOn(bankService, 'createToSheet').mockRejectedValueOnce(new NotFoundException());

                await expect(service['createToSheet']({...params, bank: undefined, group: undefined} as any)).rejects.toThrow(NotFoundException)
            });

            it('Should return error when unable to save group.', async () => {
                jest.spyOn(service, 'findOne').mockResolvedValue(null);

                jest.spyOn(bankService, 'createToSheet').mockResolvedValue(mockEntity.bank);

                jest.spyOn(groupService, 'createToSheet').mockRejectedValueOnce(new NotFoundException());

                await expect(service['createToSheet']({...params, group: undefined} as any)).rejects.toThrow(NotFoundException)
            });
        });

        describe('initializeWithWorksheet', () => {
            it('Should return an error when dont have summary.', async () => {
                jest.spyOn(business, 'getWorkSheetTitle').mockReturnValue({
                    year: 2025,
                    nextRow: 14,
                    groupName: 'Personal',
                });

                spreadsheetMock.workSheet.cell.mockReturnValueOnce({ value: undefined} as any);
                await expect(service['initializeWithWorksheet'](spreadsheetMock, financeMockEntity)).rejects.toThrow(ConflictException);
            });

            it('Should persist in database successfully.', async () => {
                jest.spyOn(business, 'getWorkSheetTitle').mockReturnValue({
                    year: 2025,
                    nextRow: 14,
                    groupName: 'Personal',
                });

                spreadsheetMock.workSheet.cell.mockReturnValueOnce({ value: 'Summary'} as any);
                jest.spyOn(service, 'getBillsFromSheet' as any).mockResolvedValueOnce({ bills: [mockEntity], nextRow: 22});
                jest.spyOn(expenseService, 'getExpensesFromSheet').mockResolvedValueOnce([expenseMockEntity]);
                const result = await service['initializeWithWorksheet'](spreadsheetMock, financeMockEntity);
                expect(result).toEqual({
                    bills: [mockEntity],
                    expenses: [expenseMockEntity],
                    groupName: 'Personal',
                });
            });
        });

        describe('getBillsFromSheet', () => {
            it('Should return default values when dont have anything in spreadsheet,', async () => {
                spreadsheetMock.parseExcelRowsToObjectList.mockReturnValue({ data: [], nextRow: 14 });
                const result = await service['getBillsFromSheet'](
                    spreadsheetMock,
                    14,
                    14,
                    2025,
                    'Personal',
                    financeMockEntity
                );
                expect(result).toEqual({
                    bills: [],
                    nextRow: 14,
                });
            });

            it('Should persist in database when have spreadsheet,', async () => {
                const parseExcelRowsToObject = {
                    ...monthsObj,
                    year: '2025',
                    type: 'PIX',
                    group: 'Personal',
                    bank: 'Nubank',
                };
                spreadsheetMock.parseExcelRowsToObjectList.mockReturnValue({ data: [parseExcelRowsToObject], nextRow: 15 });
                jest.spyOn(service, 'createToSheet' as any).mockResolvedValueOnce(mockEntity);
                const result = await service['getBillsFromSheet'](
                    spreadsheetMock,
                    14,
                    14,
                    2025,
                    'Personal',
                    financeMockEntity
                );
                expect(result).toEqual({
                    bills: [mockEntity],
                    nextRow: 15,
                });
            });

            it('Should persist in database when have spreadsheet and dont have type.', async () => {
                const parseExcelRowsToObjectWithoutType = {
                    ...monthsObj,
                    year: '2025',
                    group: 'Personal',
                    bank: 'Nubank',
                };
                spreadsheetMock.parseExcelRowsToObjectList.mockReturnValue({ data: [parseExcelRowsToObjectWithoutType], nextRow: 15 });
                jest.spyOn(service, 'createToSheet' as any).mockResolvedValueOnce(mockEntity);
                const result = await service['getBillsFromSheet'](
                    spreadsheetMock,
                    14,
                    14,
                    2025,
                    'Personal',
                    financeMockEntity
                );
                expect(result).toEqual({
                    bills: [mockEntity],
                    nextRow: 15,
                });
            });
        });
    });
});
