import { type User } from '../auth/entities/user.entity';
import { type SeedsGenerated, type SeedsResultItem } from '../shared';

import { type PokemonAbility } from './entities/ability.entity';
import { type PokemonMove } from './entities/move.entity';
import { type Pokemon } from './entities/pokemon.entity';
import { type PokemonType } from './entities/type.entity';

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