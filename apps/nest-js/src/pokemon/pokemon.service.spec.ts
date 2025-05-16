import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { PokeApiService } from '@repo/business/pokemon/poke-api/service/service';

import { Pokemon } from './entities/pokemon.entity';

import { PokemonAbilityService } from './ability/ability.service';
import { PokemonMoveService } from './move/move.service';
import { PokemonService } from './pokemon.service';
import { PokemonTypeService } from './type/type.service';

describe('PokemonService', () => {
    let service: PokemonService;
    let repository: Repository<Pokemon>;
    let pokeApiService: PokeApiService;
    let typeService: PokemonTypeService;
    let moveService: PokemonMoveService;
    let abilityService: PokemonAbilityService;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PokemonService,
                { provide: getRepositoryToken(Pokemon), useClass: Repository },
                {
                    provide: PokeApiService, useValue: {
                        limit: 1302,
                        getAll: jest.fn(),
                        getByName: jest.fn(),
                    }
                },
                {
                    provide: PokemonTypeService,
                    useValue: {
                        findList: jest.fn(),
                    },
                },
                {
                    provide: PokemonMoveService,
                    useValue: {
                        findList: jest.fn(),
                    },
                },
                {
                    provide: PokemonAbilityService,
                    useValue: {
                        findList: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<PokemonService>(PokemonService);
        repository = module.get<Repository<Pokemon>>(getRepositoryToken(Pokemon));
        pokeApiService = module.get<PokeApiService>(PokeApiService);
        abilityService = module.get<PokemonAbilityService>(PokemonAbilityService);
        moveService = module.get<PokemonMoveService>(PokemonMoveService);
        typeService = module.get<PokemonTypeService>(PokemonTypeService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
        expect(pokeApiService).toBeDefined();
        expect(abilityService).toBeDefined();
        expect(moveService).toBeDefined();
        expect(typeService).toBeDefined();
    });
});
