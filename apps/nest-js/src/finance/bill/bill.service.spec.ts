import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BILL_MOCK } from '../../mocks/bill.mock';
import { Bill } from '../../entities/bill.entity';
import { FINANCE_MOCK } from '../../mocks/finance.mock';
import { type Finance } from '../../entities/finance.entity';

import { BankService } from './bank/bank.service';
import { BillService } from './bill.service';
import { CategoryService } from './category/category.service';
import { type CreateBillDto } from './dto/create-bill.dto';
import { ExpenseService } from './expense/expense.service';

import { ConflictException } from '@nestjs/common';


describe('BillService', () => {
  let service: BillService;
  let bankService: BankService;
  let categoryService: CategoryService;
  let expenseService: ExpenseService;
  let repository: Repository<Bill>;

  const mockEntity: Bill = BILL_MOCK;
  const financeMockEntity: Finance = FINANCE_MOCK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          BillService,
        { provide: getRepositoryToken(Bill), useClass: Repository },
        {
          provide: BankService,
          useValue: {
            treatEntityParam: jest.fn(),
          },
        },
        {
          provide: ExpenseService,
          useValue: {
            seed: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            softRemove: jest.fn(),
            saveExpense: jest.fn(),
            buildUpdate: jest.fn(),
            buildCreation: jest.fn(),
            treatEntitiesParams: jest.fn(),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            seed: jest.fn(),
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
});
