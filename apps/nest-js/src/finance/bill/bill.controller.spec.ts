import { Test, type TestingModule } from '@nestjs/testing';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { BillController } from './bill.controller';
import { BillService } from './bill.service';

describe('BillController', () => {
  let controller: BillController;
  let service: BillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillController],
      providers: [
        {
          provide: BillService,
          useValue: {
            list: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findOne: jest.fn(),
            findAllBills: jest.fn(),
            addExpense: jest.fn(),
            updateExpense: jest.fn(),
            removeExpense: jest.fn(),
            findOneExpense: jest.fn(),
            findAllExpense: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BillController>(BillController);
    service = module.get<BillService>(BillService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
