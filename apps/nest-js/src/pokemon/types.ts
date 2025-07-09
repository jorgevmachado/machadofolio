import { type User } from '../auth/entities/user.entity';

export type PokemonSeederParams = {
    users?: Array<User>;
    listJson?: Array<unknown>;
    moveListJson?: Array<unknown>;
    typeListJson?: Array<unknown>;
    abilityListJson?: Array<unknown>;
}