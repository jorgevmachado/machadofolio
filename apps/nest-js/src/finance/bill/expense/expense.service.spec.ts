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

import { Expense } from '../../../entities/expense.entity';
import { ExpenseService } from './expense.service';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let repository: Repository<Expense>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          ExpenseService,
        { provide: getRepositoryToken(Expense), useClass: Repository },
      ],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
    repository = module.get<Repository<Expense>>(getRepositoryToken(Expense));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
