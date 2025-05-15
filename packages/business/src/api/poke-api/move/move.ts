import { Http } from '@repo/services/http/http';

import type { IPokeApiModuleConfig } from '../types';

import type { IMoveResponse } from './types';

export class Move extends Http {
    constructor({ baseUrl, headers }: IPokeApiModuleConfig) {
        super(baseUrl, { headers });
    }

    async getByOrder(order: number): Promise<IMoveResponse> {
        return this.get(`move/${order}`);
    }
}