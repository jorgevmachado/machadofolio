import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { PokemonGrowthRateController } from './growth-rate.controller';
import { PokemonGrowthRateService } from './growth-rate.service';
import { POKEMON_GROWTH_MOCK } from '../mocks/growth';
import { PokemonGrowthRate } from '../entities/growth-rate.entity';


describe('TypeController', () => {
    let controller: PokemonGrowthRateController;
    let service: PokemonGrowthRateService;
    const mockEntity: PokemonGrowthRate = POKEMON_GROWTH_MOCK;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PokemonGrowthRateController],
            providers: [
                { provide: PokemonGrowthRateService, useValue: { findAll: jest.fn(), findOne: jest.fn() } }
            ],
        }).compile();

        controller = module.get<PokemonGrowthRateController>(PokemonGrowthRateController);
        service = module.get<PokemonGrowthRateService>(PokemonGrowthRateService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('Should return an list of pokemon growth', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue([mockEntity]);

            expect(await controller.findAll({})).toEqual([mockEntity]);
        });
    });

    describe('findOne', () => {
        it('Should return an pokemon growth', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockEntity);

            expect(await controller.findOne(mockEntity.name)).toEqual(
                mockEntity,
            );
        });
    });
});