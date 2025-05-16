import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { POKEMON_ABILITY_MOCK } from '../mocks/ability.mock';
import { PokemonAbility } from '../entities/ability.entity';

import { PokemonAbilityService } from './ability.service';

describe('AbilityService', () => {
  let service: PokemonAbilityService;
  let repository: Repository<PokemonAbility>;
  const mockEntity: PokemonAbility = POKEMON_ABILITY_MOCK;

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

  describe('findList', () => {
    it('Should return undefined when dont received list', async () => {
      const result = await service.findList();
      expect(result).toBeUndefined();
    });

    it('Should return an list of moves from the database', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        getOne: jest.fn().mockReturnValueOnce(mockEntity),
      } as any);

      const result = await service.findList([mockEntity]);
      expect(result).toEqual([mockEntity]);
    });

    it('must save a list of pokemon moves in the database when none exist', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        getOne: jest.fn().mockReturnValueOnce(null),
      } as any);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        getOne: jest.fn().mockReturnValueOnce(mockEntity),
      } as any);

      const result = await service.findList([mockEntity]);
      expect(result).toEqual([mockEntity]);
    });
  });
});
