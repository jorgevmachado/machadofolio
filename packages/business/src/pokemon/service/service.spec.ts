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

import { PokemonService } from './service';


jest.mock('../../api');

describe('Pokemon Service', () => {
    let service: PokemonService;
    let mockNest: jest.Mocked<Nest>;
    const mockEntity = POKEMON_MOCK;
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
        xit('should successfully get an pokemon', async () => {
            mockNest.pokemon.getOne.mockResolvedValue(mockEntity);
            const result = await service.get(mockEntity.id);

            expect(mockNest.pokemon.getOne).toHaveBeenCalledWith(mockEntity.id,undefined);
            expect(result).toEqual(mockEntity);
        });
    });

    describe('getAll', () => {
        xit('should successfully getAll pokemon list', async () => {
            mockNest.pokemon.getAll.mockResolvedValue(mockEntityList);
            const result = await service.getAll({});

            expect(mockNest.pokemon.getAll).toHaveBeenCalledWith({},undefined);
            expect(result).toEqual(mockEntityList);
        });

        xit('should successfully getAll pokemon list paginate', async () => {
            mockNest.pokemon.getAll.mockResolvedValue(mockEntityPaginate);
            const result = await service.getAll(mockPaginateParams);

            expect(mockNest.pokemon.getAll).toHaveBeenCalledWith(
                mockPaginateParams,
                undefined
            );
            expect(result).toEqual(mockEntityPaginate);
        });
    });
});