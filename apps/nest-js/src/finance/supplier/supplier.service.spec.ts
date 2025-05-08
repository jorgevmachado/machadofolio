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

import { Supplier } from '../entities/supplier.entity';
import { SupplierService } from './supplier.service';
import { SupplierTypeService } from './type/type.service';

describe('SupplierService', () => {
  let repository: Repository<Supplier>;
  let service: SupplierService;
  let supplierTypeService: SupplierTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          SupplierService,
        { provide: getRepositoryToken(Supplier), useClass: Repository },
        {
          provide: SupplierTypeService,
          useValue: {
            findOne: jest.fn(),
            seed: jest.fn(),
            treatEntityParam: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<Repository<Supplier>>(getRepositoryToken(Supplier));
    supplierTypeService = module.get<SupplierTypeService>(SupplierTypeService);
    service = module.get<SupplierService>(SupplierService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(supplierTypeService).toBeDefined();
    expect(service).toBeDefined();
  });
});
