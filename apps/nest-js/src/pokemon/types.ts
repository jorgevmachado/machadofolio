import { type User } from '../auth/entities/user.entity';

import { SeedsGenerated, SeedsResultItem } from '../shared';

import { Pokemon } from './entities/pokemon.entity';
import { PokemonMove } from './entities/move.entity';
import { PokemonType } from './entities/type.entity';
import { PokemonAbility } from './entities/ability.entity';

export type PokemonSeederParams = {
    users?: Array<User>;
    listJson?: Array<unknown>;
    moveListJson?: Array<unknown>;
    typeListJson?: Array<unknown>;
    abilityListJson?: Array<unknown>;
}

export type GeneratedPokemonSeeds = {
    moves: SeedsGenerated<PokemonMove>;
    types: SeedsGenerated<PokemonType>;
    pokemons: SeedsGenerated<Pokemon>;
    abilities: SeedsGenerated<PokemonAbility>;
}
export type PokemonSeedsResult = {
    move: SeedsResultItem;
    type: SeedsResultItem;
    ability: SeedsResultItem;
    pokemon: SeedsResultItem;
}