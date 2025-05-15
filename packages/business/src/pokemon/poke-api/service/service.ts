import { extractLastNumberFromUrl } from '@repo/services/number/number';

import { PokeApi } from '../../../api';

import Pokemon from '../../pokemon';

import { PokeApiBusiness } from '../business';

import type { getAllParams } from './types';

import { PokeApiMoveService } from '../move';

export class PokeApiService {
    public limit: number = 1302;

    private readonly pokeApi: PokeApi;

    private readonly moveService: PokeApiMoveService;

    constructor() {
        this.pokeApi = new PokeApi();
        this.moveService = new PokeApiMoveService(this.pokeApi);
    }

    get move(): PokeApiMoveService {
        return this.moveService;
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
        return await Promise.all([
            await this.pokeApi.getByName(entity.name),
            await this.pokeApi.specie.getByPokemonName(entity.name)
        ]).then(([pokemonByName, specieByPokemonName]) => {
            return business.convertResponseToPokemon(entity, pokemonByName, specieByPokemonName);
        });
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