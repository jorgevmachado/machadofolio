import { POKEMON_TRAINER } from '../../mock';

jest.mock('../../../api');

jest.mock('../trainer', () => ({
  __esModule: true,
  default: function Bank(response) {
    Object.assign(this, POKEMON_TRAINER, response);
  },
  Bank: function Bank(response) {
    Object.assign(this, POKEMON_TRAINER, response);
  },
}));

jest.mock('../../../shared', () => ({
  BaseService: class {
    private repo: any;
    constructor(repo) {
      this.repo = repo;
    }
    create(...args) {
      return this.repo.create(...args);
    }
    update(...args) {
      return this.repo.update(...args);
    }
    delete(...args) {
      return this.repo.delete(...args);
    }
    remove(...args) {
      return this.repo.delete(...args);
    }
    get(...args) {
      return this.repo.getOne(...args);
    }
    getAll(...args) {
      return this.repo.getAll(...args);
    }
  },
}));

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { type Nest } from '../../../api';

import { PokemonTrainerService } from './service';
import { PokemonTrainerEntity } from '../types';

describe('Pokemon Trainer Service', () => {
  let service: PokemonTrainerService;
  let mockNest: jest.Mocked<Nest>;

  const mockEntity = POKEMON_TRAINER as unknown as PokemonTrainerEntity;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    mockNest = {
      pokemon: {
        trainer: {
          getAll: jest.fn(),
          getOne: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
          initialize: jest.fn(),
        },
      },
    } as unknown as jest.Mocked<Nest>;

    service = new PokemonTrainerService(mockNest);
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('constructor', () => {
    it('should be instantiated correctly', () => {
      expect(service).toBeDefined();
    });

    it('should receive the Nest dependency in the constructor', () => {
      expect(service['nest']).toBe(mockNest);
    });
  });

  describe('initialize', () => {
    it('should initialize the finance', async () => {
      mockNest.pokemon.trainer.initialize.mockResolvedValue(mockEntity);
      const result = await service.initialize();
      expect(mockNest.pokemon.trainer.initialize).toHaveBeenCalled();
      expect(result.id).toEqual(mockEntity.id);
      expect(result.user.id).toEqual(mockEntity.user.id);
      expect(result.capture_rate).toEqual(45);
      expect(result.captured_pokemons).toEqual(mockEntity.captured_pokemons);
    });
  });
});