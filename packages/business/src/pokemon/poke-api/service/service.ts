import { PokeApi } from '../../../api';

import Pokemon from '../../pokemon';

import { PokeApiBusiness } from '../business';

import type { getAllParams } from './types';

export class PokeApiService {
    public limit: number = 1302;

    private pokeApi: PokeApi;

    constructor() {
        this.pokeApi = new PokeApi();
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
}