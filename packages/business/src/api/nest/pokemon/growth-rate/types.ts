import type { IPokemonBase } from '../types';

export type IGrowthRate = IPokemonBase & {
  formula: string;
}