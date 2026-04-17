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

import { POKEMON_MOCK } from '../mock';

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

jest.mock('../../api');

describe('Pokemon Service', () => {
    let service: PokemonService;
    let mockNest: jest.Mocked<Nest>;
    const mockEntity = POKEMON_MOCK as unknown as PokemonEntity;
    const mockPaginateParams = { page: 1, limit: 10 };
    const mockEntityList = [mockEntity, mockEntity];
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

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockNest = {
            pokemon: {
                getAll: jest.fn(),
                getOne: jest.fn(),
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
});