import { Test, type TestingModule } from '@nestjs/testing';
import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';

import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

describe('SupplierController', () => {
  let controller: SupplierController;
  let service: SupplierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [
        {
          provide: SupplierService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            seed: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SupplierController>(SupplierController);
    service = module.get<SupplierService>(SupplierService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
