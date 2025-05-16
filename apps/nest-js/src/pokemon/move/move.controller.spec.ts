import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { MoveController } from './move.controller';
import { PokemonMoveService } from './move.service';


describe('MoveController', () => {
  let controller: MoveController;
  let service: PokemonMoveService;

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
});
