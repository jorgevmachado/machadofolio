import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { POKEMON_TYPE_MOCK } from '../mocks/type';
import type { PokemonType } from '../entities/type.entity';

import { PokemonTypeService } from './type.service';
import { TypeController } from './type.controller';


describe('TypeController', () => {
    let controller: TypeController;
    let service: PokemonTypeService;
    const mockEntity: PokemonType = POKEMON_TYPE_MOCK;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TypeController],
            providers: [
                { provide: PokemonTypeService, useValue: { findAll: jest.fn(), findOne: jest.fn() } }
            ],
        }).compile();

        controller = module.get<TypeController>(TypeController);
        service = module.get<PokemonTypeService>(PokemonTypeService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('Should return an list of pokemon move', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue([mockEntity]);

            expect(await controller.findAll({})).toEqual([mockEntity]);
        });
    });

    describe('findOne', () => {
        it('Should return an pokemon move', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockEntity);

            expect(await controller.findOne(mockEntity.name)).toEqual(
                mockEntity,
            );
        });
    });
});