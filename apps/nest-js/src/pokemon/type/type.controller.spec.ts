import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { PokemonTypeService } from './type.service';
import { TypeController } from './type.controller';


describe('TypeController', () => {
  let controller: TypeController;
  let service: PokemonTypeService;

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
});
