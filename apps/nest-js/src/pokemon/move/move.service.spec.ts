import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { PokeApiService } from '@repo/business/pokemon/poke-api/service/service';

import { PokemonMove } from '../entities/move.entity';

import { PokemonMoveService } from './move.service';
import { MOVE_MOCK } from '../mocks/move.mock';

describe('MoveService', () => {
    let service: PokemonMoveService;
    let repository: Repository<PokemonMove>;
    let pokeApiService: PokeApiService;
    const mockEntity: PokemonMove = MOVE_MOCK;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PokemonMoveService,
              { provide: getRepositoryToken(PokemonMove), useClass: Repository },
              {
                provide: PokeApiService, useValue: { move: { getOne: jest.fn() }}
              }
            ],
        }).compile();

        service = module.get<PokemonMoveService>(PokemonMoveService);
        repository = module.get<Repository<PokemonMove>>(getRepositoryToken(PokemonMove));
        pokeApiService = module.get<PokeApiService>(PokeApiService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
        expect(pokeApiService).toBeDefined();
    });

    describe('findList', () => {
        it('Should return undefined when dont received list', async () => {
            const result = await service.findList();
            expect(result).toBeUndefined();
        });

        it('Should return an list of moves from the database', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            const result = await service.findList([mockEntity]);
            expect(result).toEqual([mockEntity]);
        });

        it('must save a list of pokemon moves in the database when none exist', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(null),
            } as any);

            jest.spyOn(pokeApiService.move, 'getOne').mockResolvedValueOnce(mockEntity);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            const result = await service.findList([mockEntity]);
            expect(result).toEqual([mockEntity]);
        });
    });
});
