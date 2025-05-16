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

            expect(mockNest.pokemon.ability.getOne).toHaveBeenCalledWith(mockEntity.id,undefined);
            expect(result).toEqual(mockEntity);
        });
    });

    describe('getAll', () => {
        it('should successfully getAll pokemon ability list', async () => {
            mockNest.pokemon.ability.getAll.mockResolvedValue(mockEntityList);
            const result = await service.getAll({});

            expect(mockNest.pokemon.ability.getAll).toHaveBeenCalledWith({},undefined);
            expect(result).toEqual(mockEntityList);
        });

        it('should successfully getAll pokemon ability list paginate', async () => {
            mockNest.pokemon.ability.getAll.mockResolvedValue(mockEntityPaginate);
            const result = await service.getAll(mockPaginateParams);

            expect(mockNest.pokemon.ability.getAll).toHaveBeenCalledWith(
                mockPaginateParams,
                undefined
            );
            expect(result).toEqual(mockEntityPaginate);
        });
    });
});