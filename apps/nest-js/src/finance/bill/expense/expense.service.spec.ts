import { Test, type TestingModule } from '@nestjs/testing';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { EExpenseType } from '@repo/business/finance/expense/enum';
import ExpenseBusiness from '@repo/business/finance/expense/business/business';

import { EXPENSE_MOCK } from '../../../mocks/expense.mock';
import { Expense } from '../../entities/expense.entity';

import { type CreateExpenseDto } from './dto/create-expense.dto';
import { EMonth } from '@repo/services/date/month/enum';
import { ExpenseService } from './expense.service';
import { MONTHS } from '@repo/services/date/month/month';
import { type Supplier } from '../../entities/supplier.entity';
import { SupplierService } from './supplier/supplier.service';
import { type UpdateExpenseDto } from './dto/update-expense.dto';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let supplierService: SupplierService;
  let repository: Repository<Expense>;

  const mockEntity: Expense = EXPENSE_MOCK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          ExpenseService,
          ExpenseBusiness,
        { provide: getRepositoryToken(Expense), useClass: Repository },
        {
          provide: SupplierService,
          useValue: {
            seeds: jest.fn(),
            findOne: jest.fn(),
            treatEntityParam: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
    supplierService = module.get<SupplierService>(SupplierService);
    repository = module.get<Repository<Expense>>(getRepositoryToken(Expense));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(supplierService).toBeDefined();
    expect(repository).toBeDefined();
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
        supplier: mockEntity.supplier,
        total_paid: 0,
        created_at: undefined,
        updated_at: undefined,
        deleted_at: undefined,
        description: undefined,
        instalment_number: createDto.instalment_number,
      };

      MONTHS.forEach((month) => {
        mockExpenseBuildCreation[month] = 0;
        mockExpenseBuildCreation[`${month}_paid`] = true;
      });

      expect(await service.buildForCreation(mockEntity.bill, createDto)).toEqual(
          mockExpenseBuildCreation,
      );
    });
  });

  describe('initialize', () => {
    it('should initialize a new expense with all parameters', async () => {
      const expenseForCurrentYear: Expense = { ...mockEntity };
      const monthsForCurrentYear = ['january', 'february', 'march'];
      monthsForCurrentYear.forEach((month) => {
        expenseForCurrentYear[month] = 100;
        expenseForCurrentYear[`${month}_paid`] = mockEntity.paid;
      })
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

    it('should initialize a new expense without type and instalment_number', async () => {
      const expense: Expense = { ...mockEntity, instalment_number: 3 };
      const expenseForCurrentYear: Expense = { ...expense };
      const monthsForCurrentYear = ['january', 'february', 'march'];
      monthsForCurrentYear.forEach((month) => {
        expenseForCurrentYear[month] = 100;
        expenseForCurrentYear[`${month}_paid`] = mockEntity.paid;
      })
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
  });

  describe('addExpenseForNextYear', () => {
    it('should add a new expense for the next year', async () => {
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
      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);
      const result = await service.customSave(mockEntity);
      expect(result).toEqual(mockEntity);
    })
  });

  describe('seeds', () => {
    it('Should return a seed empty when received a empty list', async () => {
      jest.spyOn(supplierService, 'seeds').mockResolvedValueOnce([mockEntity.supplier]);

      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      expect(await service.seeds({ billList: [mockEntity.bill]})).toEqual([]);
    });

    it('should seed the database when exist in database', async () => {
      jest.spyOn(supplierService, 'seeds').mockResolvedValueOnce([mockEntity.supplier]);

      jest
          .spyOn(repository, 'find')
          .mockResolvedValueOnce([mockEntity]);

      expect(await service.seeds({
        billList: [mockEntity.bill],
        expenseListJson: [mockEntity],
        supplierListJson: [mockEntity.supplier],
        supplierTypeListJson: [mockEntity.supplier.type],
      })).toEqual([mockEntity])
    });

    it('should seed the database when not exist in database', async () => {
      jest.spyOn(supplierService, 'seeds').mockResolvedValueOnce([mockEntity.supplier]);

      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

      expect(await service.seeds({
        billList: [mockEntity.bill],
        expenseListJson: [mockEntity],
        supplierListJson: [mockEntity.supplier],
        supplierTypeListJson: [mockEntity.supplier.type],
      })).toEqual([mockEntity])
    });
  });
});
