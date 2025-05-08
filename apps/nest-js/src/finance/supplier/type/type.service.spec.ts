import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { SupplierType } from '../../entities/type.entity';
import { SupplierTypeService } from './type.service';

describe('TypeService', () => {
  let service: SupplierTypeService;
  let repository: Repository<SupplierType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierTypeService,
        { provide: getRepositoryToken(SupplierType), useClass: Repository },
      ],
    }).compile();

    service = module.get<SupplierTypeService>(SupplierTypeService);
    repository = module.get<Repository<SupplierType>>(
        getRepositoryToken(SupplierType),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
