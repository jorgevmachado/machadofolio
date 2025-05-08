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

import { FINANCE_MOCK } from '../mocks/finance.mock';
import { Finance } from '../entities/finance.entity';

import { BillService } from './bill/bill.service';
import { FinanceService } from './finance.service';
import { type User } from '../entities/user.entity';
import { USER_MOCK } from '../mocks/user.mock';


describe('FinanceService', () => {
  let repository: Repository<Finance>;
  let service: FinanceService;
  let billService: BillService;

  const mockEntity: Finance = FINANCE_MOCK;
  const mockUser: User = USER_MOCK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceService,
        { provide: getRepositoryToken(Finance), useClass: Repository },
        {
          provide: BillService,
          useValue: {
            seed: jest.fn(),
            expenseSeed: jest.fn(),
            billCategorySeed: jest.fn(),
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
});
