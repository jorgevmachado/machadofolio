import { type PokeApi } from '../../../../api';
import { PokemonMove } from '../../../move';

export class PokeApiMoveService {

    constructor(private pokeApi: PokeApi) {}

    async getOne(move: PokemonMove): Promise<PokemonMove> {
        return this.pokeApi.move.getByOrder(move.order).then((response) => {
            const effect_entries = response?.effect_entries[0];
            return new PokemonMove({
                ...move,
                pp: response?.pp,
                type: response?.type?.name,
                power: response?.power,
                target: response?.target?.name,
                effect: effect_entries?.effect ?? '',
                priority: response?.priority,
                accuracy: response?.accuracy,
                short_effect: effect_entries?.short_effect ?? '',
                damage_class: response?.damage_class?.name,
                effect_chance: response?.effect_chance,
            });
        });
    }

}
