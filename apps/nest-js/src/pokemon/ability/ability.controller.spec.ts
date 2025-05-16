import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';


import { AbilityController } from './ability.controller';
import { PokemonAbilityService } from './ability.service';

describe('AbilityController', () => {
  let controller: AbilityController;
  let service: PokemonAbilityService;

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
});
