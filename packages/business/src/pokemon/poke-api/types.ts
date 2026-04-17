import type {
    IEvolutionResponse,
    IPokemonByNameResponse,
    IPokemonPaginateResponse,
    IPokemonResponse,
    ISpecieResponse
} from '../../api';

export type PokemonResponse = IPokemonResponse;

export type PokemonPaginateResponse<T> = IPokemonPaginateResponse<T>;

export type PokemonByNameResponse = IPokemonByNameResponse;

export type PokemonSpecieResponse = ISpecieResponse;

export type EvolutionResponse = IEvolutionResponse;