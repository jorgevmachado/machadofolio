import { Http } from '@repo/services';

import type { IPokeApiModuleConfig } from '../types';

import { type IGrowthRateResponse } from './types';

export class GrowthRate extends Http {
  constructor({ baseUrl ,headers }: IPokeApiModuleConfig) {
    super(baseUrl ,{ headers });
  }

  async getByOrder(order: number): Promise<IGrowthRateResponse> {
    return this.get(`growth-rate/${ order }`);
  }
}