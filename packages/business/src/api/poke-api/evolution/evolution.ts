import { Http } from '@repo/services/http/http';

import type { IPokeApiModuleConfig } from '../types';

import type { IEvolutionResponse } from './types';

export class Evolution extends Http {
    constructor({ baseUrl, headers }: IPokeApiModuleConfig) {
        super(baseUrl, { headers });
    }

     async getByOrder(order: number): Promise<IEvolutionResponse> {
         return this.get(`evolution-chain/${order}`);
     }
}