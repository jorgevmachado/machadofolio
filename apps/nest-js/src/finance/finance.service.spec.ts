import { spreadsheetMock } from '../../jest.setup';

jest.mock('../shared', () => {
  class ServiceMock {
    save = jest.fn();
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

import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { Buffer } from 'buffer';
import { ConflictException } from '@nestjs/common';
import { Readable } from 'stream';
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
        { provide: GroupService, useValue: { seeds: jest.fn(), findAll: jest.fn() } },
        { provide: SupplierService, useValue: { seeds: jest.fn() } },
        {
          provide: BillService,
          useValue: {
            seeds: jest.fn(),
            expense: {
              seeds: jest.fn(),
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
      jest.spyOn(billService, 'spreadsheetProcessing').mockImplementation( async () => undefined);
      spreadsheetMock.generateSheetBuffer.mockImplementation(async () => Buffer.from('mock-buffer'));
      const result = await service.generateDocument(USER_MOCK, 2025);
      expect(result).toEqual(Buffer.from('mock-buffer'));
    });
  });

  describe('seeds', () => {
    it('should run all seeds and return list of total seeds', async () => {
      jest.spyOn(service, 'seed' as any).mockResolvedValueOnce([mockEntity]);

      jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any ) => {
        seedMethod(bankMockEntity);
        return [bankMockEntity];
      });
      jest.spyOn(bankService, 'seeds').mockResolvedValueOnce([bankMockEntity]);

      jest.spyOn(supplierService, 'seeds').mockResolvedValueOnce({
        supplierList: [supplierMockEntity],
        supplierTypeList: [supplierTypeMockEntity]
      });

      jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any ) => {
        seedMethod(groupMockEntity);
        return [groupMockEntity];
      });
      jest.spyOn(groupService, 'seeds').mockResolvedValueOnce([groupMockEntity]);

      jest.spyOn(service.seeder, 'currentSeeds').mockReturnValue([mockEntity]);

      jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any ) => {
        seedMethod(billMockEntity);
        return [billMockEntity];
      });
      jest.spyOn(billService, 'seeds').mockResolvedValueOnce([billMockEntity]);

      jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any ) => {
        seedMethod(expenseMockEntity);
        return [expenseMockEntity];
      });
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
      jest.spyOn(service, 'seed' as any).mockResolvedValueOnce([mockEntity]);

      jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any ) => {
        seedMethod();
        return [];
      });
      jest.spyOn(bankService, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});


      jest.spyOn(supplierService, 'seeds').mockResolvedValueOnce({
        supplierList: [supplierMockEntity],
        supplierTypeList: [supplierTypeMockEntity]
      });

      jest.spyOn(groupService, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});

      jest.spyOn(service.seeder, 'currentSeeds').mockReturnValue([mockEntity]);

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
      jest.spyOn(service, 'seed' as any).mockResolvedValueOnce([]);

      jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any ) => {
        seedMethod();
        return [];
      });

      jest.spyOn(bankService, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});

      jest.spyOn(supplierService, 'seeds').mockResolvedValueOnce({
        supplierList: [supplierMockEntity],
        supplierTypeList: [supplierTypeMockEntity]
      });

      jest.spyOn(groupService, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});

      jest.spyOn(service.seeder, 'currentSeeds').mockReturnValue([]);

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
          service.initializeWithDocument({...mockFile, buffer: undefined } as any, mockUser)
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

  describe('privates', () => {
    describe('validateFinance', () => {
      it('should return throw error when user dont has finance.', () => {
        expect(() => service['validateFinance']({...mockUser, finance: undefined})).toThrow(ConflictException);
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
        expect(await service['seed']([mockEntity], [{...mockUser, cpf: '12345678912'}])).toEqual([]);
      });
    });
  });
});
