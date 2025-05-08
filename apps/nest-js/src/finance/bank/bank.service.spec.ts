import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Bank } from './entities/bank.entity';
import { BankService } from './bank.service';

describe('BankService', () => {
  let service: BankService;
  let repository: Repository<Bank>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          BankService,
        { provide: getRepositoryToken(Bank), useClass: Repository },
      ],
    }).compile();

    service = module.get<BankService>(BankService);
    repository = module.get<Repository<Bank>>(getRepositoryToken(Bank));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
