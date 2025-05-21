import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BANK_MOCK } from '../mocks/bank.mock';
import { BILL_MOCK } from '../mocks/bill.mock';
import { EXPENSE_MOCK } from '../mocks/expense.mock';
import { FINANCE_MOCK } from '../mocks/finance.mock';
import { GROUP_MOCK } from '../mocks/group.mock';
import { SUPPLIER_MOCK } from '../mocks/supplier.mock';
import { SUPPLIER_TYPE_MOCK } from '../mocks/supplier-type.mock';
import { USER_MOCK } from '../mocks/user.mock';
import { type User } from '../auth/entities/user.entity';

import { type Bank } from './entities/bank.entity';
import { BankService } from './bank/bank.service';
import type { Bill } from './entities/bill.entity';
import { BillService } from './bill/bill.service';
import type { Expense } from './entities/expense.entity';
import { Finance } from './entities/finance.entity';
import { FinanceService } from './finance.service';
import { type Group } from './entities/group.entity';
import { GroupService } from './group/group.service';
import { type Supplier } from './entities/supplier.entity';
import { SupplierService } from './supplier/supplier.service';
import { type SupplierType } from './entities/type.entity';

describe('FinanceService', () => {
  let repository: Repository<Finance>;
  let service: FinanceService;
  let bankService: BankService;
  let groupService: GroupService;
  let supplierService: SupplierService;
  let billService: BillService;

  const mockEntity: Finance = FINANCE_MOCK;
  const bankMockEntity: Bank = BANK_MOCK;
  const groupMockEntity: Group = GROUP_MOCK;
  const supplierMockEntity: Supplier = SUPPLIER_MOCK;
  const supplierTypeMockEntity: SupplierType = SUPPLIER_TYPE_MOCK;
  const billMockEntity: Bill = BILL_MOCK;
  const expenseMockEntity: Expense = EXPENSE_MOCK;
  const mockUser: User = USER_MOCK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceService,
        { provide: getRepositoryToken(Finance), useClass: Repository },
        { provide: BankService, useValue: { seeds: jest.fn() } },
        { provide: GroupService, useValue: { seeds: jest.fn() } },
        { provide: SupplierService, useValue: { seeds: jest.fn() } },
        {
          provide: BillService,
          useValue: {
            seeds: jest.fn(),
            expense: {
              seeds: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<Repository<Finance>>(getRepositoryToken(Finance));
    billService = module.get<BillService>(BillService);
    bankService = module.get<BankService>(BankService);
    groupService = module.get<GroupService>(GroupService);
    supplierService = module.get<SupplierService>(SupplierService);
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
      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);
      expect(await service.initialize(mockEntity.user)).toEqual(
          mockEntity,
      );
    });
  });

  describe('seeds', () => {
    it('should run all seeds and return list of total seeds', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([mockEntity]);

      jest.spyOn(bankService, 'seeds').mockResolvedValueOnce([bankMockEntity]);

      jest.spyOn(supplierService, 'seeds').mockResolvedValueOnce({
        supplierList: [supplierMockEntity],
        supplierTypeList: [supplierTypeMockEntity]
      });

      jest.spyOn(groupService, 'seeds').mockResolvedValueOnce([groupMockEntity]);

      jest.spyOn(billService, 'seeds').mockResolvedValueOnce([billMockEntity]);

      jest.spyOn(billService.expense, 'seeds').mockResolvedValueOnce([expenseMockEntity]);

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
    });

    it('should run all seeds and return list of total seeds with some seeds empty', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

      jest.spyOn(bankService, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});

      jest.spyOn(supplierService, 'seeds').mockResolvedValueOnce({
        supplierList: [supplierMockEntity],
        supplierTypeList: [supplierTypeMockEntity]
      });

      jest.spyOn(groupService, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});

      jest.spyOn(billService, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});

      jest.spyOn(billService.expense, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});

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
    });

    it('should run all seeds and return list of total seeds empty', async () => {
      const financeMockEntity = {
        ...mockEntity,
        user: {
          ...mockEntity.user,
          cpf: '10482980001',
        }
      }
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(financeMockEntity);

      jest.spyOn(bankService, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});

      jest.spyOn(supplierService, 'seeds').mockResolvedValueOnce({
        supplierList: [supplierMockEntity],
        supplierTypeList: [supplierTypeMockEntity]
      });

      jest.spyOn(groupService, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});

      jest.spyOn(billService, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});

      jest.spyOn(billService.expense, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});

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
    });
  });
  // describe('seeds', () => {
  //   it('should run all seeds and return completion message', async () => {
  //
  //     jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
  //       andWhere: jest.fn(),
  //       withDeleted: jest.fn(),
  //       leftJoinAndSelect: jest.fn().mockReturnThis(),
  //       getOne: jest.fn().mockReturnValueOnce(null),
  //     } as any);
  //
  //     jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);
  //
  //     jest.spyOn(billService, 'seeds').mockResolvedValueOnce([billMockEntity]);
  //
  //
  //     jest.spyOn(billService.expense, 'seeds').mockResolvedValueOnce([expenseMockEntity]);
  //
  //
  //     const result = await service.seeds({ user: mockUser });
  //     expect(result).toEqual({
  //       message: 'Seeds finances executed successfully',
  //     })
  //   });
  //
  //   it('should return error when not seed finance', async () => {
  //     jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
  //       andWhere: jest.fn(),
  //       withDeleted: jest.fn(),
  //       leftJoinAndSelect: jest.fn().mockReturnThis(),
  //       getOne: jest.fn().mockReturnValueOnce(null),
  //     } as any);
  //
  //     await expect(service.seeds({ user: mockUser })).rejects.toThrowError(ConflictException);
  //   });
  //
  //   it('should run only finance seed successfully', async () => {
  //
  //     jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
  //       andWhere: jest.fn(),
  //       withDeleted: jest.fn(),
  //       leftJoinAndSelect: jest.fn().mockReturnThis(),
  //       getOne: jest.fn().mockReturnValueOnce(null),
  //     } as any);
  //
  //     jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);
  //
  //     jest.spyOn(billService, 'seeds').mockResolvedValueOnce({ message: 'error'});
  //
  //     jest.spyOn(billService.expense, 'seeds').mockResolvedValueOnce({ message: 'error'});
  //
  //     const result = await service.seeds({ user: mockUser });
  //     expect(result).toEqual({
  //       message: 'Seeds finances executed successfully',
  //     })
  //   });
  // });
});
