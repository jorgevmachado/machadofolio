import { Test, type TestingModule } from '@nestjs/testing';

import { SupplierTypeService } from './type.service';
import { TypeController } from './type.controller';

describe('TypeController', () => {
  let controller: TypeController;
  let service: SupplierTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeController],
      providers: [
        {
          provide: SupplierTypeService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findOne: jest.fn(),
            seed: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TypeController>(TypeController);
    service = module.get<SupplierTypeService>(SupplierTypeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
