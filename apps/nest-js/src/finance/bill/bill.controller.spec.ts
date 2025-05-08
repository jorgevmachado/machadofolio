import { Test, type TestingModule } from '@nestjs/testing';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { BILL_MOCK } from '../../mocks/bill.mock';
import { type Bill } from '../../entities/bill.entity';
import { USER_MOCK } from '../../mocks/user.mock';
import { type User } from '../../entities/user.entity';

import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { type CreateBillDto } from './dto/create-bill.dto';

describe('BillController', () => {
  let controller: BillController;
  let service: BillService;

  const mockEntity: Bill = BILL_MOCK;
  const userMockEntity: User = USER_MOCK;

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

  describe('create', () => {
    it('should create a new bill and save it', async () => {
      const createBill: CreateBillDto = {
        type: mockEntity.type,
        year: mockEntity.year,
        bank: mockEntity.bank.name,
        category: mockEntity.category.name,
      };
      jest.spyOn(service, 'create').mockResolvedValue(mockEntity);

      expect(await controller.create(userMockEntity, createBill)).toEqual(
          mockEntity,
      );
    });
  });
});
