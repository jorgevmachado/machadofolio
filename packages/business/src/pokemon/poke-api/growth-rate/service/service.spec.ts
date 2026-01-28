import {
  afterEach ,
  beforeEach ,
  describe ,
  expect ,
  it ,
  jest ,
} from '@jest/globals';

import { type PokeApi } from '../../../../api';

import { GrowthRateResponse } from '../types';

import { POKEMON_GROWTH_RATE_MOCK } from '../../mock';
import { PokeApiGrowthRateService } from './service';
import { PokemonGrowthRateEntity } from '../../../growth-rate';

jest.mock('../../../growth-rate' ,() => ({
  __esModule: true ,
  default: function PokemonGrowthRate(response) {
    return Object.assign(Object.create(PokemonGrowthRate.prototype) ,
      { ...POKEMON_GROWTH_RATE_MOCK ,...response });
  } ,
  PokemonGrowthRate: function PokemonGrowthRate(response) {
    return Object.assign(Object.create(PokemonGrowthRate.prototype) ,
      { ...POKEMON_GROWTH_RATE_MOCK ,...response });
  } ,
}));

jest.mock('../../../../api');

describe('Pokemon Growth Rate Service' ,() => {
  let service: PokeApiGrowthRateService;
  let mockPokeApi: jest.Mocked<PokeApi>;

  const growthEntityMock: PokemonGrowthRateEntity = POKEMON_GROWTH_RATE_MOCK;

  const growthRateResponseMock: GrowthRateResponse = {
    id: growthEntityMock.order ,
    name: growthEntityMock.name ,
    levels: [] ,
    formula: growthEntityMock.formula ,
    descriptions: [] ,
    pokemon_species: [] ,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    mockPokeApi = {
      growthRate: {
        getByUrl: jest.fn() ,
      } ,
    } as unknown as jest.Mocked<PokeApi>;

    service = new PokeApiGrowthRateService(mockPokeApi);

  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('getByUrl' ,() => {
    it('Should return a growth rate of Pokemon' ,async () => {

      mockPokeApi.growthRate.getByUrl.mockResolvedValue(growthRateResponseMock);

      const result = await service.getByUrl(growthEntityMock.url);
      expect(result.id).toEqual(growthEntityMock.id);
      expect(result.url).toEqual(growthEntityMock.url);
      expect(result.name).toEqual(growthEntityMock.name);
      expect(result.order).toEqual(growthEntityMock.order);
      expect(result.formula).toEqual(growthEntityMock.formula);
      expect(result.created_at).toEqual(growthEntityMock.created_at);
      expect(result.updated_at).toEqual(growthEntityMock.updated_at);
      expect(result.deleted_at).toEqual(growthEntityMock.deleted_at);
    });

  });
});