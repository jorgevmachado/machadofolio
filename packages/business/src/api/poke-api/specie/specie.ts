import { Http } from '@repo/services/http/http';

import type { IPokeApiModuleConfig } from '../types';

import type { ISpecieResponse } from './types';

export class Specie extends Http{
    constructor({ baseUrl, headers }: IPokeApiModuleConfig) {
        super(baseUrl, { headers });
    }

    async getByPokemonName(name: string): Promise<ISpecieResponse> {
        return this.get(`pokemon-species/${name}`);
    }
}