export type IPokeApiConfig = {
    baseUrl?: string;
}

export type IPokeApiModuleConfig = {
    baseUrl: string;
    headers: Record<string, string>;
}

export type IPokemonPaginateResponse<T> = {
    next?: string;
    count: number;
    results: Array<T>;
    previous?: string;
}

export type IPokemonResponse = {
    url: string;
    name: string;
}

export type IPokemonByNameResponse = {
    name: string;
    order: number;
    types: Array<IPokemonTypeResponse>;
    moves: Array<IPokemonMoveResponse>;
    stats: Array<IPokemonStatResponse>;
    sprites: IPokemonSpritesResponse;
    abilities: Array<IPokemonAbilityResponse>;
}

type IPokemonTypeResponse = {
    slot: number;
    type: IPokemonResponse;
}

type IPokemonMoveResponse = {
    move: IPokemonResponse;
}

type IPokemonStatResponse = {
    stat: IPokemonResponse;
    base_stat: number;
}

type IPokemonSpritesResponse  = {
    other: {
        dream_world: {
            back_gray?: string;
            front_gray?: string;
            back_shiny?: string;
            front_shiny?: string;
            back_female?: string;
            front_female?: string;
            back_default?: string;
            front_default?: string;
            back_transparent?: string;
            front_transparent?: string;
            back_shiny_female?: string;
            front_shiny_female?: string;
            back_shiny_transparent?: string;
            front_shiny_transparent?: string;
        };
    };
    front_default?: string;
}

type IPokemonAbilityResponse  = {
    slot: number;
    ability: IPokemonResponse;
    is_hidden: boolean;
}