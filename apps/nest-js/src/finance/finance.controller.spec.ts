import { Test, type TestingModule } from '@nestjs/testing';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { FINANCE_MOCK } from '../mocks/finance.mock';
import { type Finance } from './entities/finance.entity';

import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';


describe('FinanceController', () => {
  let service: FinanceService;
  let controller: FinanceController;

  const mockEntity: Finance = FINANCE_MOCK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanceController],
      providers: [
        {
          provide: FinanceService,
          useValue: {
            seed: jest.fn(),
            seeds: jest.fn(),
            basicSeeds: jest.fn(),
            initialize: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FinanceController>(FinanceController);
    service = module.get<FinanceService>(FinanceService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  describe('initialize', () => {
    it('should initialize the database ', async () => {
      jest
          .spyOn(service, 'initialize')
          .mockResolvedValueOnce(mockEntity);
      expect(await controller.initialize(mockEntity.user)).toEqual(mockEntity);
    });
  });
});
