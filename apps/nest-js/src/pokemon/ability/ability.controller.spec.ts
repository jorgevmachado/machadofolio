import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { POKEMON_ABILITY_MOCK } from '../mocks/ability.mock';
import type { PokemonAbility } from '../entities/ability.entity';

import { AbilityController } from './ability.controller';
import { PokemonAbilityService } from './ability.service';

describe('AbilityController', () => {
  let controller: AbilityController;
  let service: PokemonAbilityService;

  const mockEntity: PokemonAbility = POKEMON_ABILITY_MOCK;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbilityController],
      providers: [{ provide: PokemonAbilityService, useValue: { findAll: jest.fn(), findOne: jest.fn() } }],
    }).compile();

    controller = module.get<AbilityController>(AbilityController);
    service = module.get<PokemonAbilityService>(PokemonAbilityService);
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
