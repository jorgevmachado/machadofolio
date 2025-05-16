import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { type Nest } from '../../../api';

import { POKEMON_MOVE_MOCK } from '../mock';

import { PokemonMoveService } from './service';

jest.mock('../../../api');

describe('Pokemon Move Service', () => {
    let service: PokemonMoveService;
    let mockNest: jest.Mocked<Nest>;

    const mockEntity = POKEMON_MOVE_MOCK;
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
                move: {
                    getAll: jest.fn(),
                    getOne: jest.fn(),
                },
            },
        } as unknown as jest.Mocked<Nest>;

        service = new PokemonMoveService(mockNest);
    });

    afterEach(() => {
        jest.resetModules();
    });
    
    describe('get', () => {
        it('should successfully get an bank', async () => {
            mockNest.pokemon.move.getOne.mockResolvedValue(mockEntity);
            const result = await service.get(mockEntity.id);

            expect(mockNest.pokemon.move.getOne).toHaveBeenCalledWith(mockEntity.id,undefined);
            expect(result).toEqual(mockEntity);
        });
    });

    describe('getAll', () => {
        it('should successfully getAll pokemon move list', async () => {
            mockNest.pokemon.move.getAll.mockResolvedValue(mockEntityList);
            const result = await service.getAll({});

            expect(mockNest.pokemon.move.getAll).toHaveBeenCalledWith({},undefined);
            expect(result).toEqual(mockEntityList);
        });

        it('should successfully getAll pokemon move list paginate', async () => {
            mockNest.pokemon.move.getAll.mockResolvedValue(mockEntityPaginate);
            const result = await service.getAll(mockPaginateParams);

            expect(mockNest.pokemon.move.getAll).toHaveBeenCalledWith(
                mockPaginateParams,
                undefined
            );
            expect(result).toEqual(mockEntityPaginate);
        });
    });
});