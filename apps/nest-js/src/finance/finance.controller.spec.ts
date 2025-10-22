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
            create: jest.fn(),
            getByUser: jest.fn(),
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
          .spyOn(service, 'create')
          .mockResolvedValueOnce(mockEntity);
      expect(await controller.create(mockEntity.user)).toEqual(mockEntity);
    });
  });

  describe('getByUser', () => {
      const responseExpected = {
          finance: mockEntity,
          groups: [],
          bills: [],
          banks: [],
          suppliers: [],
          supplierTypes: [],
          expenses: [],
          incomes: [],
          incomeSources: [],
          total: 0,
          allPaid: false,
          totalPaid: 0,
          totalPending: 0,
      }
      it('should return finance by user ', async () => {
          jest.spyOn(service, 'getByUser').mockResolvedValueOnce(responseExpected);
          const result = await controller.find(mockEntity.user);
          expect(result.finance).toEqual(responseExpected.finance);
          expect(result.groups).toEqual(responseExpected.groups);
          expect(result.bills).toEqual(responseExpected.bills);
          expect(result.banks).toEqual(responseExpected.banks);
          expect(result.suppliers).toEqual(responseExpected.suppliers);
          expect(result.supplierTypes).toEqual(responseExpected.supplierTypes);
          expect(result.expenses).toEqual(responseExpected.expenses);
          expect(result.incomes).toEqual(responseExpected.incomes);
          expect(result.incomeSources).toEqual(responseExpected.incomeSources);
          expect(result.total).toEqual(responseExpected.total);
          expect(result.allPaid).toEqual(responseExpected.allPaid);
          expect(result.totalPaid).toEqual(responseExpected.totalPaid);
          expect(result.totalPending).toEqual(responseExpected.totalPending);
      })

  });
});
