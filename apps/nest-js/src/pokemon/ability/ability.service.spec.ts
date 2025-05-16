import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { PokemonAbility } from '../entities/ability.entity';

import { PokemonAbilityService } from './ability.service';

describe('AbilityService', () => {
  let service: PokemonAbilityService;
  let repository: Repository<PokemonAbility>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          PokemonAbilityService,
        { provide: getRepositoryToken(PokemonAbility), useClass: Repository },
      ],
    }).compile();

    service = module.get<PokemonAbilityService>(PokemonAbilityService);
    repository = module.get<Repository<PokemonAbility>>(getRepositoryToken(PokemonAbility));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
