import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { PokeApiService } from '@repo/business/pokemon/poke-api/service/service';

import { PokemonMove } from '../entities/move.entity';

import { PokemonMoveService } from './move.service';

describe('MoveService', () => {
    let service: PokemonMoveService;
    let repository: Repository<PokemonMove>;
    let pokeApiService: PokeApiService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PokemonMoveService,
              { provide: getRepositoryToken(PokemonMove), useClass: Repository },
              {
                provide: PokeApiService, useValue: {}
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
});
