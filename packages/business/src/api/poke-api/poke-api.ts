import { Http } from '@repo/services';

import type { IPokeApiConfig, IPokemonByNameResponse, IPokemonPaginateResponse, IPokemonResponse } from './types';

import { Evolution } from './evolution';
import { Move } from './move';
import { Specie } from './specie';

export class PokeApi extends Http {
    private readonly specieModule: Specie;
    private readonly moveModule: Move;
    private readonly evolutionModule: Evolution;

    constructor({ baseUrl = 'https://pokeapi.co/api/v2' }: IPokeApiConfig = {}) {
        const headers = { 'Content-Type': 'application/json' };
        super(baseUrl, { headers });
        this.specieModule = new Specie({ baseUrl, headers });
        this.evolutionModule = new Evolution({ baseUrl, headers });
        this.moveModule = new Move({ baseUrl, headers });
    }

    get specie(): Specie {
        return this.specieModule;
    }

    get move(): Move {
        return this.moveModule;
    }

    get evolution(): Evolution {
        return this.evolutionModule;
    }

    async getAll(offset: number, limit: number): Promise<IPokemonPaginateResponse<IPokemonResponse>> {
        return this.get('pokemon', { params: { offset, limit } });
    }

    async getByName(name: string): Promise<IPokemonByNameResponse> {
        return this.get(`pokemon/${name}`);
    }

}