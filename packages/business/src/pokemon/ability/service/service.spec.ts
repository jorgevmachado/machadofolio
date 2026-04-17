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

import { POKEMON_ABILITY_MOCK } from '../mock';

jest.mock('../ability', () => ({
    __esModule: true,
    default: function PokemonAbility(response) {
        Object.assign(this, POKEMON_ABILITY_MOCK, response);
    },
    PokemonAbility: function PokemonAbility(response) {
        Object.assign(this, POKEMON_ABILITY_MOCK, response);
    },
}));

import { PokemonAbilityService } from './service';

jest.mock('../../../api');

describe('Pokemon Ability Service', () => {
    let service: PokemonAbilityService;
    let mockNest: jest.Mocked<Nest>;

    const mockEntity = POKEMON_ABILITY_MOCK;
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
                ability: {
                    getAll: jest.fn(),
                    getOne: jest.fn(),
                },
            },
        } as unknown as jest.Mocked<Nest>;

        service = new PokemonAbilityService(mockNest);
    });

    afterEach(() => {
        jest.resetModules();
    });
    
    describe('get', () => {
        it('should successfully get an bank', async () => {
            mockNest.pokemon.ability.getOne.mockResolvedValue(mockEntity);
            const result = await service.get(mockEntity.id);

            expect(mockNest.pokemon.ability.getOne).toHaveBeenCalledWith(mockEntity.id);
            expect(result).toEqual(mockEntity);
        });
    });

    describe('getAll', () => {
        it('should successfully getAll pokemon ability list', async () => {
            mockNest.pokemon.ability.getAll.mockResolvedValue(mockEntityList);
            const result = await service.getAll({});

            expect(mockNest.pokemon.ability.getAll).toHaveBeenCalledWith({});
            expect(result).toEqual(mockEntityList);
        });

        it('should successfully getAll pokemon ability list paginate', async () => {
            mockNest.pokemon.ability.getAll.mockResolvedValue(mockEntityPaginate);
            const result = await service.getAll(mockPaginateParams);

            expect(mockNest.pokemon.ability.getAll).toHaveBeenCalledWith(
                mockPaginateParams
            );
            expect(result).toEqual(mockEntityPaginate);
        });
    });
});