import { extractLastNumberFromUrl ,Http } from '@repo/services';

import type { IPokeApiModuleConfig } from '../types';

import { type IGrowthRateResponse } from './types';

export class GrowthRate extends Http {
  constructor({ baseUrl ,headers }: IPokeApiModuleConfig) {
    super(baseUrl ,{ headers });
  }

  async getByUrl(url: string): Promise<IGrowthRateResponse> {
    const order = extractLastNumberFromUrl(url);
    return this.get(`growth-rate/${ order }`);
  }
}