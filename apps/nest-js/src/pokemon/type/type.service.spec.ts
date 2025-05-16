import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { PokemonType } from '../entities/type.entity';

import { PokemonTypeService } from './type.service';


describe('PokemonTypeService', () => {
  let service: PokemonTypeService;
  let repository: Repository<PokemonType>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          PokemonTypeService,
        { provide: getRepositoryToken(PokemonType), useClass: Repository },
      ],
    }).compile();

    service = module.get<PokemonTypeService>(PokemonTypeService);
    repository = module.get<Repository<PokemonType>>(getRepositoryToken(PokemonType));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
