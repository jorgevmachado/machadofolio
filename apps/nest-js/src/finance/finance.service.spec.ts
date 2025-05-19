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

import { BILL_MOCK } from '../mocks/bill.mock';
import { EXPENSE_MOCK } from '../mocks/expense.mock';
import { FINANCE_MOCK } from '../mocks/finance.mock';
import { USER_MOCK } from '../mocks/user.mock';
import { type User } from '../auth/entities/user.entity';

import type { Bill } from './entities/bill.entity';
import type { Expense } from './entities/expense.entity';
import { Finance } from './entities/finance.entity';

import { BillService } from './bill/bill.service';
import { FinanceService } from './finance.service';
import { ConflictException } from '@nestjs/common';





describe('FinanceService', () => {
  let repository: Repository<Finance>;
  let service: FinanceService;
  let billService: BillService;

  const mockEntity: Finance = FINANCE_MOCK;
  const billMockEntity: Bill = BILL_MOCK;
  const expenseMockEntity: Expense = EXPENSE_MOCK;
  const mockUser: User = USER_MOCK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceService,
        { provide: getRepositoryToken(Finance), useClass: Repository },
        {
          provide: BillService,
          useValue: {
            seeds: jest.fn(),
            expenseSeeds: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<Repository<Finance>>(getRepositoryToken(Finance));
    billService = module.get<BillService>(BillService);
    service = module.get<FinanceService>(FinanceService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
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
    it('should run all seeds and return completion message', async () => {

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValueOnce(null),
      } as any);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

      jest.spyOn(billService, 'seeds').mockResolvedValueOnce([billMockEntity]);

      jest.spyOn(billService, 'expenseSeeds').mockResolvedValueOnce([expenseMockEntity]);

      const result = await service.seeds({ user: mockUser });
      expect(result).toEqual({
        message: 'Seeds finances executed successfully',
      })
    });

    it('should return error when not seed finance', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValueOnce(null),
      } as any);

      await expect(service.seeds({ user: mockUser })).rejects.toThrowError(ConflictException);
    });

    it('should run only finance seed successfully', async () => {

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValueOnce(null),
      } as any);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

      jest.spyOn(billService, 'seeds').mockResolvedValueOnce({ message: 'error'});

      jest.spyOn(billService, 'expenseSeeds').mockResolvedValueOnce({ message: 'error'});

      const result = await service.seeds({ user: mockUser });
      expect(result).toEqual({
        message: 'Seeds finances executed successfully',
      })
    });
  });
});
