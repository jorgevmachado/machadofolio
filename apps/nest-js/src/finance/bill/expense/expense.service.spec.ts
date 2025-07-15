import { Test, type TestingModule } from '@nestjs/testing';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { type CycleOfMonths, EMonth, MONTHS, Spreadsheet, normalize, toSnakeCase } from '@repo/services';

import { EExpenseType, ExpenseBusiness } from '@repo/business';

import { EXPENSE_MOCK } from '../../../mocks/expense.mock';

import { Expense } from '../../entities/expense.entity';
import { type Supplier } from '../../entities/supplier.entity';
import { SupplierService } from '../../supplier/supplier.service';

import { type CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseService } from './expense.service';
import { type UpdateExpenseDto } from './dto/update-expense.dto';

jest.mock('@repo/services');

describe('ExpenseService', () => {
  let service: ExpenseService;
  let expenseBusiness: ExpenseBusiness;
  let supplierService: SupplierService;
  let repository: Repository<Expense>;
  let spreadsheetMock: jest.Mocked<Spreadsheet>;

  const mockEntity: Expense = EXPENSE_MOCK;
  const monthsObj = MONTHS.reduce((acc, month) => {
    acc[month] = 50;
    acc[`${month}_paid`] = true;
    return acc;
  }, {} as CycleOfMonths);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          ExpenseService,
          ExpenseBusiness,
        {
          provide: ExpenseBusiness,
          useValue: {
            initialize: jest.fn(),
            reinitialize: jest.fn(),
            calculate: jest.fn(),
            parseToDetailsTable: jest.fn(),
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
      ],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
    supplierService = module.get<SupplierService>(SupplierService);
    repository = module.get<Repository<Expense>>(getRepositoryToken(Expense));
    expenseBusiness = module.get<ExpenseBusiness>(ExpenseBusiness);
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
    expect(supplierService).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('business', () => {
    it('should return expense business module', () => {
      expect(service.business).toBe(expenseBusiness);
    });
  });

  describe('buildForCreation', () => {
    it('should build a creation expense.', async () => {
      const createDto: CreateExpenseDto = {
        type: EExpenseType.FIXED,
        paid: true,
        value: 93.59,
        supplier: mockEntity.supplier.name,
        instalment_number: 1,
      };

      jest
          .spyOn(supplierService, 'treatEntityParam')
          .mockResolvedValueOnce(mockEntity.supplier);

      const mockExpenseBuildCreation = {
        ...mockEntity,
        id: undefined,
        bill: mockEntity.bill,
        paid: createDto.paid,
        type: createDto.type,
        name: `${mockEntity.bill.name} ${mockEntity.supplier.name}`,
        total: 0,
        children: undefined,
        supplier: mockEntity.supplier,
        total_paid: 0,
        created_at: undefined,
        updated_at: undefined,
        deleted_at: undefined,
        description: undefined,
        is_aggregate: false,
        aggregate_name: undefined,
        instalment_number: createDto.instalment_number,
      };

      MONTHS.forEach((month) => {
        mockExpenseBuildCreation[month] = 0;
        mockExpenseBuildCreation[`${month}_paid`] = true;
      });

      const result = await service.buildForCreation(mockEntity.bill, createDto);

      expect(result.id).toBeUndefined();
      expect(result.bill).toEqual(mockEntity.bill);
      expect(result.paid).toEqual(mockEntity.paid);
      expect(result.type).toEqual(createDto.type);
      expect(result.name).toEqual(mockEntity.name);
      expect(result.total).toEqual(0);
      expect(result.supplier).toEqual(mockEntity.supplier);
    });

    it('should build a creation expense with parent.', async () => {
      const createDto: CreateExpenseDto = {
        type: EExpenseType.FIXED,
        paid: true,
        value: 93.59,
        supplier: mockEntity.supplier.name,
        instalment_number: 1,
        parent: mockEntity.id,
        aggregate_name: 'son'
      };

      jest
          .spyOn(supplierService, 'treatEntityParam')
          .mockResolvedValueOnce(mockEntity.supplier);

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getOne: jest.fn().mockReturnValueOnce(mockEntity),
      } as any);
      const name =  `${mockEntity.bill.name} ${createDto.aggregate_name} ${mockEntity.supplier.name}`;
      const mockExpenseBuildCreation = {
        ...mockEntity,
        id: undefined,
        bill: mockEntity.bill,
        paid: createDto.paid,
        type: createDto.type,
        name,
        name_code: toSnakeCase(normalize(name)),
        total: 0,
        parent: mockEntity,
        children: undefined,
        supplier: mockEntity.supplier,
        total_paid: 0,
        created_at: undefined,
        updated_at: undefined,
        deleted_at: undefined,
        description: undefined,
        is_aggregate: true,
        aggregate_name: createDto.aggregate_name,
        instalment_number: createDto.instalment_number,
      };

      MONTHS.forEach((month) => {
        mockExpenseBuildCreation[month] = 0;
        mockExpenseBuildCreation[`${month}_paid`] = true;
      });

      const result = await service.buildForCreation(mockEntity.bill, createDto);

      expect(result.id).toBeUndefined();
      expect(result.bill).toEqual(mockExpenseBuildCreation.bill);
      expect(result.paid).toEqual(mockExpenseBuildCreation.paid);
      expect(result.type).toEqual(mockExpenseBuildCreation.type);
      expect(result.total).toEqual(mockExpenseBuildCreation.total);
      expect(result.supplier).toEqual(mockExpenseBuildCreation.supplier);
    });
  });

  describe('initialize', () => {
    it('should initialize a new expense with all parameters', async () => {
      const expenseForCurrentYear: Expense = { ...mockEntity };
      const monthsForCurrentYear = ['january', 'february', 'march'];
      monthsForCurrentYear.forEach((month) => {
        expenseForCurrentYear[month] = 100;
        expenseForCurrentYear[`${month}_paid`] = mockEntity.paid;
      });

      jest.spyOn(expenseBusiness, 'initialize').mockReturnValue({
        nextYear: expenseForCurrentYear.year + 1,
        monthsForNextYear: [],
        expenseForNextYear: undefined,
        expenseForCurrentYear,
        monthsForCurrentYear,
        requiresNewBill: false
      });

      jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(expenseForCurrentYear);

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getMany: jest.fn().mockReturnValueOnce([]),
      } as any);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(expenseForCurrentYear);

      const result = await service.initialize({
        type: mockEntity.type,
        expense: mockEntity,
        value: 100,
        month: EMonth.JANUARY,
        instalment_number: 3
      });

      expect(result).toEqual({
        nextYear: expenseForCurrentYear.year + 1,
        monthsForNextYear: [],
        expenseForNextYear: undefined,
        expenseForCurrentYear,
        monthsForCurrentYear,
        requiresNewBill: false
      });
    });

    it('should initialize a new expense with all parameters and parent and children empty', async () => {
      const mockEntityWithParent = { ...mockEntity, parent: mockEntity, aggregate_name: 'son', is_aggregate: true };
      const expenseForCurrentYear: Expense = { ...mockEntityWithParent };
      const monthsForCurrentYear = ['january', 'february', 'march'];
      monthsForCurrentYear.forEach((month) => {
        expenseForCurrentYear[month] = 100;
        expenseForCurrentYear[`${month}_paid`] = mockEntity.paid;
      })

      jest.spyOn(expenseBusiness, 'initialize').mockReturnValue({
        nextYear: expenseForCurrentYear.year + 1,
        monthsForNextYear: [],
        expenseForNextYear: undefined,
        expenseForCurrentYear,
        monthsForCurrentYear,
        requiresNewBill: false
      });

      jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(expenseForCurrentYear);

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getMany: jest.fn().mockReturnValueOnce([]),
      } as any);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(expenseForCurrentYear);

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getOne: jest.fn().mockReturnValueOnce({...mockEntity, children: []}),
      } as any);

      jest.spyOn(repository, 'save').mockResolvedValueOnce({...mockEntity, children: [expenseForCurrentYear]});

      const result = await service.initialize({
        type: mockEntity.type,
        expense: mockEntityWithParent,
        value: 100,
        month: EMonth.JANUARY,
        instalment_number: 3
      });

      expect(result.nextYear).toEqual(expenseForCurrentYear.year + 1);
      expect(result.monthsForNextYear).toEqual([]);
      expect(result.expenseForNextYear).toBeUndefined();
      expect(result.requiresNewBill).toBeFalsy();
      expect(result.monthsForCurrentYear).toEqual(monthsForCurrentYear);
      expect(result.expenseForCurrentYear).toEqual(expenseForCurrentYear);
    });

    it('should initialize a new expense with all parameters and parent and children with entity exist', async () => {
      const mockEntityWithParent = { ...mockEntity, parent: mockEntity, aggregate_name: 'son', is_aggregate: true };
      const expenseForCurrentYear: Expense = { ...mockEntityWithParent };
      const monthsForCurrentYear = ['january', 'february', 'march'];
      monthsForCurrentYear.forEach((month) => {
        expenseForCurrentYear[month] = 100;
        expenseForCurrentYear[`${month}_paid`] = mockEntity.paid;
      })

      jest.spyOn(expenseBusiness, 'initialize').mockReturnValue({
        nextYear: expenseForCurrentYear.year + 1,
        monthsForNextYear: [],
        expenseForNextYear: undefined,
        expenseForCurrentYear,
        monthsForCurrentYear,
        requiresNewBill: false
      });

      jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(expenseForCurrentYear);

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getMany: jest.fn().mockReturnValueOnce([]),
      } as any);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(expenseForCurrentYear);

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getOne: jest.fn().mockReturnValueOnce({...mockEntity, children: [expenseForCurrentYear]}),
      } as any);

      jest.spyOn(repository, 'save').mockResolvedValueOnce({...mockEntity, children: [expenseForCurrentYear]});

      const result = await service.initialize({
        type: mockEntity.type,
        expense: mockEntityWithParent,
        value: 100,
        month: EMonth.JANUARY,
        instalment_number: 3
      });

      expect(result.nextYear).toEqual(expenseForCurrentYear.year + 1);
      expect(result.monthsForNextYear).toEqual([]);
      expect(result.expenseForNextYear).toBeUndefined();
      expect(result.requiresNewBill).toBeFalsy();
      expect(result.monthsForCurrentYear).toEqual(monthsForCurrentYear);
      expect(result.expenseForCurrentYear).toEqual(expenseForCurrentYear);
    });

    it('should initialize a new expense with all parameters and parent and children with entity not exist', async () => {
      const mockEntityWithParent = { ...mockEntity, parent: mockEntity, aggregate_name: 'son', is_aggregate: true };
      const expenseForCurrentYear: Expense = { ...mockEntityWithParent };
      const monthsForCurrentYear = ['january', 'february', 'march'];
      monthsForCurrentYear.forEach((month) => {
        expenseForCurrentYear[month] = 100;
        expenseForCurrentYear[`${month}_paid`] = mockEntity.paid;
      });

      jest.spyOn(expenseBusiness, 'initialize').mockReturnValue({
        nextYear: expenseForCurrentYear.year + 1,
        monthsForNextYear: [],
        expenseForNextYear: undefined,
        expenseForCurrentYear,
        monthsForCurrentYear,
        requiresNewBill: false
      });

      jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(expenseForCurrentYear);

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getMany: jest.fn().mockReturnValueOnce([]),
      } as any);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(expenseForCurrentYear);

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getOne: jest.fn().mockReturnValueOnce({...mockEntity, children: [{...mockEntity, id: '12334' }]}),
      } as any);

      jest.spyOn(repository, 'save').mockResolvedValueOnce({...mockEntity, children: [expenseForCurrentYear]});

      const result = await service.initialize({
        type: mockEntity.type,
        expense: mockEntityWithParent,
        value: 100,
        month: EMonth.JANUARY,
        instalment_number: 3
      });

      expect(result.nextYear).toEqual(expenseForCurrentYear.year + 1);
      expect(result.monthsForNextYear).toEqual([]);
      expect(result.expenseForNextYear).toBeUndefined();
      expect(result.requiresNewBill).toBeFalsy();
      expect(result.monthsForCurrentYear).toEqual(monthsForCurrentYear);
      expect(result.expenseForCurrentYear).toEqual(expenseForCurrentYear);
    });

    it('should initialize a new expense without type and instalment_number', async () => {
      const expense: Expense = { ...mockEntity, instalment_number: 3 };
      const expenseForCurrentYear: Expense = { ...expense };
      const monthsForCurrentYear = ['january', 'february', 'march'];
      monthsForCurrentYear.forEach((month) => {
        expenseForCurrentYear[month] = 100;
        expenseForCurrentYear[`${month}_paid`] = mockEntity.paid;
      })

      jest.spyOn(expenseBusiness, 'initialize').mockReturnValue({
        nextYear: expenseForCurrentYear.year + 1,
        monthsForNextYear: [],
        expenseForNextYear: undefined,
        expenseForCurrentYear,
        monthsForCurrentYear,
        requiresNewBill: false
      });

      jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(expenseForCurrentYear);

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getMany: jest.fn().mockReturnValueOnce([]),
      } as any);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(expenseForCurrentYear);

      const result = await service.initialize({
        expense,
        value: 100,
        month: EMonth.JANUARY,
      });
      expect(result.nextYear).toEqual(expenseForCurrentYear.year + 1);
      expect(result.monthsForNextYear).toEqual([]);
      expect(result.expenseForNextYear).toBeUndefined();
      expect(result.expenseForCurrentYear).toEqual(expenseForCurrentYear);
      expect(result.monthsForCurrentYear).toEqual(monthsForCurrentYear);
      expect(result.requiresNewBill).toBeFalsy();
    });

    it('should initialize with error', async () => {
      const expense: Expense = { ...mockEntity, instalment_number: 3 };
      const expenseForCurrentYear: Expense = { ...expense };
      const monthsForCurrentYear = ['january', 'february', 'march'];
      monthsForCurrentYear.forEach((month) => {
        expenseForCurrentYear[month] = 100;
        expenseForCurrentYear[`${month}_paid`] = mockEntity.paid;
      })

      jest.spyOn(expenseBusiness, 'initialize').mockReturnValue({
        nextYear: expenseForCurrentYear.year + 1,
        monthsForNextYear: [],
        expenseForNextYear: undefined,
        expenseForCurrentYear,
        monthsForCurrentYear,
        requiresNewBill: false
      });

      jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(expenseForCurrentYear);

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getMany: jest.fn().mockReturnValueOnce([mockEntity]),
      } as any);

      await expect(service.initialize({
        expense,
        value: 100,
        month: EMonth.JANUARY,
      })).rejects.toThrowError(ConflictException);
    });
  });

  describe('addExpenseForNextYear', () => {
    it('should add a new expense for the next year', async () => {
      jest.spyOn(expenseBusiness, 'reinitialize').mockReturnValue(mockEntity);

      jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(mockEntity);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);
      const result = await service.addExpenseForNextYear(mockEntity.bill, ['january'], mockEntity)
      expect(result).toEqual(mockEntity)
    });
  });

  describe('buildForUpdate', () => {
    it('should build for update expense.', async () => {
      const newSupplier: Supplier = {
        ...mockEntity.supplier,
        name: 'New Supplier',
      }
      const updateDto: UpdateExpenseDto = {
        type: EExpenseType.FIXED,
        paid: true,
        supplier: newSupplier,
        description: 'New description',
      }

      MONTHS.forEach((month) => {
        updateDto[month] = 1;
        updateDto[`${month}_paid`] = true;
      });

      jest
          .spyOn(supplierService, 'treatEntityParam')
          .mockResolvedValueOnce(newSupplier);

      const result = await service.buildForUpdate(mockEntity, updateDto);
      expect(result.type).toEqual(updateDto.type);
      expect(result.paid).toEqual(updateDto.paid);
      expect(result.supplier.name).toEqual(newSupplier.name);
      expect(result.description).toEqual(updateDto.description);
      MONTHS.forEach((month) => {
        expect(result[month]).toBe(1);
        expect(result[`${month}_paid`]).toBeTruthy();
      });
    })

    it('should build for update expense without update supplier.', async () => {
      const result = await service.buildForUpdate(mockEntity, {});
      expect(result.supplier.name).toEqual(mockEntity.supplier.name);
    })
  });

  describe('customSave', () => {
    it('should save a expense successfully', async () => {
      jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(mockEntity);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);
      const result = await service.customSave(mockEntity);
      expect(result).toEqual(mockEntity);
    })
  });

  describe('seeds', () => {
    it('Should return a seed empty when received a empty list', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      expect(await service.seeds({ bills: [mockEntity.bill], suppliers: [mockEntity.supplier]})).toEqual([]);
    });

    it('should seed the database when exist in database', async () => {
      const mock = {
        ...mockEntity,
        parent: undefined,
        children: [mockEntity],
        is_aggregate: false,
        aggregate_name: undefined,
      }
      jest
          .spyOn(repository, 'find')
          .mockResolvedValueOnce([mock]);

      jest
          .spyOn(repository, 'find')
          .mockResolvedValueOnce([mockEntity]);

      expect(await service.seeds({
        bills: [{...mockEntity.bill, expenses: [mockEntity]}],
        suppliers: [mockEntity.supplier],
        expenseListJson: [{...mockEntity.bill, expenses: [mockEntity]}],
        billListJson: [{...mockEntity.bill, expenses: [mockEntity]}]
      })).toEqual([mockEntity])
    });

    it('should seed the database when not exist in database', async () => {
      const mock = {
        ...mockEntity,
        parent: undefined,
        children: [mockEntity],
        is_aggregate: false,
        aggregate_name: undefined,
      }

      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(mock);
      jest.spyOn(repository, 'save').mockResolvedValueOnce({ ...mockEntity, parent: mock, });

      const result = await service.seeds({
        bills: [{...mock.bill, expenses: [mockEntity]}],
        suppliers: [mock.supplier],
        expenseListJson: [mock],
        billListJson: [{...mock.bill, expenses: [mockEntity]}]
      })

      expect(result).toHaveLength(1);
    });
  });

  describe('getExpensesFromSheet', () => {
    it('Should return empty list of expense when received an empty list.', async () => {

      jest.spyOn(expenseBusiness, 'parseToDetailsTable').mockReturnValue([]);

      const result = await service['getExpensesFromSheet'](
          2025,
          spreadsheetMock,
          [mockEntity.bill],
          'Personal',
          22
      );

      expect(result).toHaveLength(0);
    });

    it('Should return list of expense with successfully.', async () => {

      jest.spyOn(expenseBusiness, 'parseToDetailsTable').mockReturnValue([mockEntity as any]);
      jest.spyOn(service, 'createToSheet' as any).mockResolvedValueOnce(mockEntity);

      const result = await service['getExpensesFromSheet'](
          2025,
          spreadsheetMock,
          [mockEntity.bill],
          'Personal',
          22
      );

      expect(result).toHaveLength(1);
    });
  });

  describe('privates', () => {
    describe('buildExpenseToSheet', () => {
      it('Should build all expense to createToSheet with default values.', () => {
        const params = {
          year: '2025',
          bill: {...mockEntity.bill, name: 'Bill'},
        }

        const result = service['buildExpenseToSheet'](params);

        expect(result.year).toEqual(2025);
        expect(result.type).toEqual(EExpenseType.VARIABLE);
        expect(result.name).toEqual('Bill ');
        expect(result.january).toEqual(0);
        expect(result.children).toBeUndefined();
        expect(result.bill.name).toEqual('Bill');
        expect(result.description).toEqual('Generated by a spreadsheet.');
        expect(result.is_aggregate).toBeFalsy();
        expect(result.supplierName).toEqual('');
        expect(result['january_paid']).toBeFalsy();
        expect(result.aggregate_name).toBeUndefined();
      });

      it('Should build all expense to createToSheet with all values.', () => {
        const params = {
          ...monthsObj,
          year: '2025',
          type: 'FIXED',
          bill: {...mockEntity.bill, name: 'Bill'},
          children: [{...mockEntity.bill, name: 'Bill'}],
          supplier: 'Supplier',
          is_aggregate: true,
          aggregate_name: 'Aggregate Name'
        }

        const result = service['buildExpenseToSheet'](params);

        expect(result.year).toEqual(2025);
        expect(result.type).toEqual(EExpenseType.FIXED);
        expect(result.name).toEqual('Bill Aggregate Name Supplier');
        expect(result.january).toEqual(50);
        expect(result.children).toHaveLength(1);
        expect(result.bill.name).toEqual('Bill');
        expect(result.description).toEqual('Generated by a spreadsheet.');
        expect(result.is_aggregate).toBeTruthy();
        expect(result.supplierName).toEqual('Supplier');
        expect(result['january_paid']).toBeTruthy();
        expect(result.aggregate_name).toEqual('Aggregate Name');
      });
    });

    describe('createToSheet', () => {
      const createToSheetParams = {
        ...monthsObj,
        year: '2025',
        type: 'FIXED',
        bill: {...mockEntity.bill, name: 'Bill'},
        children: [{...mockEntity.bill, name: 'Bill'}],
        supplier: 'Supplier',
        is_aggregate: true,
        aggregate_name: 'Aggregate Name'
      }
      it('It should return a expense when found in the database and should not save.', async () => {

        const findOneSpy = jest.spyOn(service, 'findOne').mockResolvedValue(mockEntity);
        const result = await service['createToSheet'](createToSheetParams);

        expect(findOneSpy).toHaveBeenCalledWith({
          value: 'Bill Aggregate Name Supplier',
          filters: [{ value: 2025, param: 'year', condition: '=' }],
          withThrow: false,
          withDeleted: true,
          withRelations: true,
        })

        expect(result).toEqual(mockEntity);
      });

      it('A new expense must persist in the database without children.', async () => {
        jest.spyOn(service, 'findOne').mockResolvedValue(null);
        jest.spyOn(expenseBusiness, 'calculate').mockReturnValue(mockEntity);
        jest.spyOn(supplierService, 'createToSheet').mockResolvedValue(mockEntity.supplier);
        jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);
        const result = await service['createToSheet'](createToSheetParams);

        expect(result).toEqual(mockEntity);
      });

      it('A new expense must persist in the database with children exist in database.', async () => {
        const mockEntityWithChildren = { ...mockEntity, is_aggregate: false, children: [mockEntity],  description: 'Generated by a spreadsheet.' };

        jest.spyOn(service, 'buildExpenseToSheet' as any).mockImplementation((params) => {
          if(params?.['bill']?.['name'] === 'Bill') {
            return mockEntityWithChildren;
          }
          return { ...mockEntity, name: 'Bill Aggregate Name Supplier' };
        });

        jest.spyOn(service, 'findOne').mockImplementation((params) => {
          if (params.value === 'Bill Aggregate Name Supplier') {
            return Promise.resolve(mockEntityWithChildren);
          }
          return Promise.resolve(null);
        })

        jest.spyOn(supplierService, 'createToSheet').mockImplementation(() => Promise.resolve(mockEntity.supplier));

        jest.spyOn(service, 'customSave').mockImplementation(() => Promise.resolve({
          ...mockEntityWithChildren,
          name: 'Bill Aggregate Name Supplier',
          children: undefined
        }));

        const result = await service['createToSheet'](createToSheetParams);

        expect(result.description).toEqual('Generated by a spreadsheet.');
      });
    });


  });
});
