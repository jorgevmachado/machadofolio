import { Test, type TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import type { CreateSeedDto } from './dto/create-seed.dto';

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

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{
        provide: AppService,
        useValue: {
          seeds: jest.fn()
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

  describe('seeds', () => {
    it('should return seeds', async () => {
      const expected = {
        users: 1,
        finances: {
          bills: 1,
          groups: 1,
          banks: 1,
          expenses: 1,
          finances: 1,
          suppliers: 1,
          supplierTypes: 1,
        },
        pokemons: {
          moves: 1,
          types: 1,
          pokemons: 1,
          abilities: 1,
        },
        message: 'Seeds successfully',
      }
      jest.spyOn(service, 'seeds').mockResolvedValueOnce(expected);
      expect(await appController.seeds(createSeedDto)).toEqual(expected);
    });
  });
});
