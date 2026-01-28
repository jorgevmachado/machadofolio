import type { IPokemonResponse } from '../types';

type IGrowthLevels = {
  level: number;
  experience: number;
}

type IGrowthDescription = {
  language: IPokemonResponse;
  description: string;
}
export type IGrowthRateResponse = {
  id: number;
  name: string;
  levels: Array<IGrowthLevels>;
  formula: string;
  descriptions: Array<IGrowthDescription>;
  pokemon_species: Array<IPokemonResponse>;
}