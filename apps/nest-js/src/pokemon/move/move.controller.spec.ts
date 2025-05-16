import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { POKEMON_MOVE_MOCK } from '../mocks/move.mock';
import type { PokemonMove } from '../entities/move.entity';

import { MoveController } from './move.controller';
import { PokemonMoveService } from './move.service';


describe('MoveController', () => {
  let controller: MoveController;
  let service: PokemonMoveService;
  const mockEntity: PokemonMove = POKEMON_MOVE_MOCK;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoveController],
      providers: [{ provide: PokemonMoveService, useValue: { findAll: jest.fn(), findOne: jest.fn() } }],
    }).compile();

    controller = module.get<MoveController>(MoveController);
    service = module.get<PokemonMoveService>(PokemonMoveService);
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
