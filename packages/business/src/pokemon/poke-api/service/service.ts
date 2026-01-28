import { extractLastNumberFromUrl } from '@repo/services';

import { type IPokemonByNameResponse ,type ISpecieResponse ,PokeApi } from '../../../api';
import Pokemon from '../../pokemon';

import { PokeApiBusiness } from '../business';
import { PokeApiGrowthRateService } from '../growth-rate';
import { PokeApiMoveService } from '../move';

import type { getAllParams } from './types';

export class PokeApiService {
    public limit: number = 1302;

    private readonly pokeApi: PokeApi;

    private readonly moveService: PokeApiMoveService;
    private readonly growthRateService: PokeApiGrowthRateService;

    constructor() {
        this.pokeApi = new PokeApi();
        this.moveService = new PokeApiMoveService(this.pokeApi);
        this.growthRateService = new PokeApiGrowthRateService(this.pokeApi);
    }

    get move(): PokeApiMoveService {
        return this.moveService;
    }

    get growthRate(): PokeApiGrowthRateService {
        return this.growthRateService;
    }

    public async getAll({ offset = 0, limit = this.limit }: getAllParams): Promise<Array<Pokemon>> {
        return this.pokeApi
            .getAll(offset, limit)
            .then((response) =>
                response?.results?.map(({ url, name }) => new Pokemon({ url, name }))
            );
    }

    public async getByName(entity: Pokemon): Promise<Pokemon> {
        const business = new PokeApiBusiness();
        const result: {
          entity: Pokemon;
          byNameResponse?: IPokemonByNameResponse;
          specieByPokemonNameResponse?: ISpecieResponse;
        } = {
          entity,
          byNameResponse: undefined,
          specieByPokemonNameResponse: undefined
        };

        try {
          result.byNameResponse =  await this.pokeApi.getByName(entity.name);
        } catch (error) {
          result.byNameResponse = undefined;
        }

        try {
          result.specieByPokemonNameResponse = await this.pokeApi.specie.getByPokemonName(entity.name);
        } catch (error) {
          result.specieByPokemonNameResponse = undefined;
        }

        return business.convertResponseToPokemon(entity, result.byNameResponse, result.specieByPokemonNameResponse);
    }

    public async getEvolutions(url: string): Promise<Array<string>> {
        const business = new PokeApiBusiness();
        const order = extractLastNumberFromUrl(url);
        return this.pokeApi
            .evolution
            .getByOrder(order)
            .then((response) => business.ensureEvolutions(response.chain));
    }
}