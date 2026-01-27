import { PokemonTrainerEntity } from '../trainer';

jest.mock('../../shared', () => ({
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

import { type Nest } from '../../api';

import {
  POKEDEX_MOCK ,
  POKEMON_MOCK ,
  POKEMON_TRAINER_MOCK,
} from '../mock';

jest.mock('../pokemon', () => ({
    __esModule: true,
    default: function Pokemon(response) {
        Object.assign(this, POKEMON_MOCK, response);
    },
    Pokemon: function Pokemon(response) {
        Object.assign(this, POKEMON_MOCK, response);
    },
}));

import type { PokemonEntity } from '../types';

import { PokemonService } from './service';
import { PokedexEntity } from '../pokedex';

jest.mock('../../api');

describe('Pokemon Service', () => {
    let service: PokemonService;
    let mockNest: jest.Mocked<Nest>;
    const mockEntity = POKEMON_MOCK as unknown as PokemonEntity;
    const mockPaginateParams = { page: 1, limit: 10 };
    const mockEntityList = [mockEntity, mockEntity];
    const pokedexEntityMock = POKEDEX_MOCK as unknown as PokedexEntity;
    const mockEntityPaginate = {
        skip: 0,
        next: 0,
        prev: 0,
        total: 0,
        pages: 0,
        results: mockEntityList,
        per_page: 0,
        current_page: 0,
    };
    const mockTrainer = {
      ...POKEMON_TRAINER_MOCK,
      pokedex: [pokedexEntityMock]
    }
    const pokemonTrainerEntity = mockTrainer as unknown as PokemonTrainerEntity;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockNest = {
            pokemon: {
                getAll: jest.fn(),
                getOne: jest.fn(),
                initialize: jest.fn(),
            }
        } as unknown as jest.Mocked<Nest>;

        service = new PokemonService(mockNest);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('get', () => {
        it('should successfully get an pokemon', async () => {
            mockNest.pokemon.getOne.mockResolvedValue(mockEntity);
            const result = await service.get(mockEntity.id);

            expect(mockNest.pokemon.getOne).toHaveBeenCalledWith(mockEntity.id);
            expect(result).toEqual(mockEntity);
        });
    });

    describe('getAll', () => {
        it('should successfully getAll pokemon list', async () => {
            mockNest.pokemon.getAll.mockResolvedValue(mockEntityList);
            const result = await service.getAll({});

            expect(mockNest.pokemon.getAll).toHaveBeenCalledWith({});
            expect(result).toEqual(mockEntityList);
        });

        it('should successfully getAll pokemon list paginate', async () => {
            mockNest.pokemon.getAll.mockResolvedValue(mockEntityPaginate);
            const result = await service.getAll(mockPaginateParams);

            expect(mockNest.pokemon.getAll).toHaveBeenCalledWith(
                mockPaginateParams
            );
            expect(result).toEqual(mockEntityPaginate);
        });
    });

    describe('initialize', () => {
      it('should successfully initialize trainer pokemon', async () => {
        mockNest.pokemon.initialize.mockResolvedValue(pokemonTrainerEntity);
        const result = await service.initialize(mockEntity.name);
        expect(mockNest.pokemon.initialize).toHaveBeenCalled();
        expect(result.id).toEqual(pokemonTrainerEntity.id);
        expect(result.user.id).toEqual(pokemonTrainerEntity.user.id);
        expect(result.pokedex).toHaveLength(1);
        expect(result.capture_rate).toEqual(pokemonTrainerEntity.capture_rate);
        expect(result.captured_pokemons).toEqual(pokemonTrainerEntity.captured_pokemons);
      });
    });
});