import { Test, type TestingModule } from '@nestjs/testing';

import type { CreateSeedDto } from './dto/create-seed.dto';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let service: AppService;
  let appController: AppController;

  const createSeedDto:CreateSeedDto = {
    auth: true,
    finance: {
      bank: true,
      bill: true,
      group: true,
      expense: true,
      supplier: true,
      finance: true,
    },
    pokemon: {
      move: true,
      type: true,
      ability: true,
      pokemon: true,
    },
  }

  const mockSeedsResult = {
      auth: { list: 1, added: 1 },
      finance: {
          bank: { list: 1, added: 1 },
          bill: { list: 1, added: 1 },
          group: { list: 1, added: 1 },
          months: { list: 1, added: 1 },
          income: { list: 1, added: 1 },
          expense: { list: 1, added: 1 },
          finance: { list: 1, added: 1 },
          supplier: { list: 1, added: 1 },
          incomeSource: { list: 1, added: 1 },
          supplierType: { list: 1, added: 1 },
      },
      pokemon: {
          move: { list: 1, added: 1 },
          type: { list: 1, added: 1 },
          ability: { list: 1, added: 1 },
          pokemon: { list: 1, added: 1 },
      },
  }

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{
        provide: AppService,
        useValue: {
            persistSeeds: jest.fn(),
            generateSeeds: jest.fn()
        }
      }],
    }).compile();

    service = app.get<AppService>(AppService);
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('root', () => {
      expect(service).toBeDefined();
      expect(appController).toBeDefined();
    });
  });

    describe('generateSeeds', () => {
        it('should generate seeds', async () => {
            jest.spyOn(service, 'generateSeeds').mockResolvedValue({ ...mockSeedsResult, message: 'Seed Generate Successfully' });
            expect(await appController.generateSeeds(createSeedDto)).toEqual({ ...mockSeedsResult, message: 'Seed Generate Successfully' });
        });
    });

    describe('persistSeeds', () => {
        it('should persist seeds', async () => {
            jest.spyOn(service, 'persistSeeds').mockResolvedValue({ ...mockSeedsResult, message: 'Seed Persist Successfully' });
            expect(await appController.persistSeeds(createSeedDto)).toEqual({ ...mockSeedsResult, message: 'Seed Persist Successfully' });
        });
    });
});
