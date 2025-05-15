import type { IPokemonResponse } from '../types';

export type IEvolutionResponse = {
    chain: {
        species: IPokemonResponse;
        evolves_to: Array<IEvolvesTo>;
    }
}

type IEvolvesTo = {
    species: IPokemonResponse;
    evolves_to: Array<IEvolvesTo>;
}