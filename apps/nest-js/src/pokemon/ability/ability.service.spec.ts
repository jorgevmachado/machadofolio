jest.mock('../../shared', () => {
  class ServiceMock {
    save = jest.fn();
    seeder = {
      entities: jest.fn(),
    };
    queries ={
      findOneByOrder: jest.fn(),
    };
    findOne = jest.fn();
  }
  return { Service: ServiceMock }
});
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
      jest.spyOn(service.queries, 'findOneByOrder').mockImplementation( async () => mockEntity);

      const result = await service.findList([mockEntity]);
      expect(result).toEqual([mockEntity]);
    });

    it('must save a list of pokemon moves in the database when none exist', async () => {
      jest.spyOn(service, 'completingData' as any).mockResolvedValueOnce(mockEntity);

      jest.spyOn(service.queries, 'findOneByOrder').mockImplementation( async ({ response, completingData }: any) => {
        completingData(mockEntity, response);
        return mockEntity;
      });


      const result = await service.findList([mockEntity]);
      expect(result).toEqual([mockEntity]);
    });
  });

  describe('seeds', () => {
    it('should seed the database when exist in database', async () => {
      jest.spyOn(service.seeder, 'entities').mockImplementation( async ( { createdEntityFn }: any) => {
        createdEntityFn(mockEntity);
        return [mockEntity];
      });

      expect(await service.seeds([mockEntity])).toEqual([mockEntity]);
    });
  });

  describe('completingData', () => {
    it('should return entity when exist in database', async () => {
      expect(await service['completingData'](mockEntity, mockEntity)).toEqual(mockEntity);
    });

    it('should save entity when not exist in database', async () => {
      jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
      jest.spyOn(service.queries, 'findOneByOrder').mockResolvedValueOnce(mockEntity)
      expect(await service['completingData'](mockEntity)).toEqual(mockEntity);
    });
  });
});
