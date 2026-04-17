import type { IMove, IPartialBaseEntity } from '../../api';

export type PokemonMoveEntity = IMove;

export type MoveConstructorParams = Omit<PokemonMoveEntity, 'id' | 'pp' | 'order' | 'priority' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialBaseEntity & {
    pp?: number;
    order?: number;
    priority?: number;
};
