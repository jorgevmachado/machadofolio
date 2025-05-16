import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { POKEMON_TYPE_MOCK } from '../mocks/type';
import { PokemonType } from '../entities/type.entity';

import { PokemonTypeService } from './type.service';

describe('PokemonTypeService', () => {
  let service: PokemonTypeService;
  let repository: Repository<PokemonType>;
  const mockEntity: PokemonType = POKEMON_TYPE_MOCK;

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
