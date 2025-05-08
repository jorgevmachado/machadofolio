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

import { Finance } from './entities/finance.entity';

import { BankService } from './bank/bank.service';
import { BillService } from './bill/bill.service';
import { FinanceService } from './finance.service';
import { SupplierService } from './supplier/supplier.service';

describe('FinanceService', () => {
  let repository: Repository<Finance>;
  let service: FinanceService;
  let supplierService: SupplierService;
  let bankService: BankService;
  let billService: BillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceService,
        { provide: getRepositoryToken(Finance), useClass: Repository },
        {
          provide: SupplierService,
          useValue: {
            seed: jest.fn(),
          },
        },
        {
          provide: BankService,
          useValue: {
            seed: jest.fn(),
          },
        },
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
    supplierService = module.get<SupplierService>(SupplierService);
    bankService = module.get<BankService>(BankService);
    billService = module.get<BillService>(BillService);
    service = module.get<FinanceService>(FinanceService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(supplierService).toBeDefined();
    expect(bankService).toBeDefined();
    expect(billService).toBeDefined();
    expect(service).toBeDefined();
  });
});
