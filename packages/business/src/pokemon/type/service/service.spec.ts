import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { type Nest } from '../../../api';

import { POKEMON_TYPE_MOCK } from '../mock';

import { PokemonTypeService } from './service';

jest.mock('../../../api');

describe('Pokemon Type Service', () => {
    let service: PokemonTypeService;
    let mockNest: jest.Mocked<Nest>;

    const mockEntity = POKEMON_TYPE_MOCK;
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
                type: {
                    getAll: jest.fn(),
                    getOne: jest.fn(),
                },
            },
        } as unknown as jest.Mocked<Nest>;

        service = new PokemonTypeService(mockNest);
    });

    afterEach(() => {
        jest.resetModules();
    });
    
    describe('get', () => {
        it('should successfully get an bank', async () => {
            mockNest.pokemon.type.getOne.mockResolvedValue(mockEntity);
            const result = await service.get(mockEntity.id);

            expect(mockNest.pokemon.type.getOne).toHaveBeenCalledWith(mockEntity.id,undefined);
            expect(result).toEqual(mockEntity);
        });
    });

    describe('getAll', () => {
        it('should successfully getAll pokemon type list', async () => {
            mockNest.pokemon.type.getAll.mockResolvedValue(mockEntityList);
            const result = await service.getAll({});

            expect(mockNest.pokemon.type.getAll).toHaveBeenCalledWith({},undefined);
            expect(result).toEqual(mockEntityList);
        });

        it('should successfully getAll pokemon type list paginate', async () => {
            mockNest.pokemon.type.getAll.mockResolvedValue(mockEntityPaginate);
            const result = await service.getAll(mockPaginateParams);

            expect(mockNest.pokemon.type.getAll).toHaveBeenCalledWith(
                mockPaginateParams,
                undefined
            );
            expect(result).toEqual(mockEntityPaginate);
        });
    });
});