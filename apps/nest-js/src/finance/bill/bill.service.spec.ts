import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Bill } from '../entities/bill.entity';
import { BillService } from './bill.service';

describe('BillService', () => {
  let service: BillService;
  let repository: Repository<Bill>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          BillService,
        { provide: getRepositoryToken(Bill), useClass: Repository },
      ],
    }).compile();

    service = module.get<BillService>(BillService);
    repository = module.get<Repository<Bill>>(getRepositoryToken(Bill));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
