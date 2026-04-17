import { PokemonAbility } from '../../ability';
import { PokemonMove } from '../../move';
import Pokemon from '../../pokemon';
import { PokemonTypeBusiness } from '../../type';

import type { EvolutionResponse, PokemonByNameResponse, PokemonSpecieResponse } from '../types';

import { type EnsureImageParams, type EnsureSpecieAttributesResult } from './types';

export default class PokeApiBusiness {
    private pokemonTypeBusiness: PokemonTypeBusiness;

    constructor() {
        this.pokemonTypeBusiness = new PokemonTypeBusiness();
    }

    convertResponseToPokemon(
        entity: Pokemon,
        pokemonByName: PokemonByNameResponse,
        specieByPokemonName: PokemonSpecieResponse
    ): Pokemon {
        return new Pokemon({
            ...entity,
            image: this.ensureImage({ sprites: pokemonByName.sprites }),
            ...this.ensureAttributes(pokemonByName.stats),
            ...this.ensureRelations(pokemonByName),
            ...this.ensureSpecieAttributes(specieByPokemonName)
        });
    }

    ensureImage(params: EnsureImageParams): string {
        const currentImage = params?.image ?? '';
        if (params?.sprites) {
            const frontDefault = params?.sprites.front_default;
            const dreamWorld = params?.sprites?.other?.dream_world?.front_default;
            const image = frontDefault || dreamWorld;
            return image ?? currentImage;
        }
        return currentImage;
    }

    ensureAttributes(params: PokemonByNameResponse['stats']): Pick<Pokemon, 'hp' | 'speed' | 'attack' | 'defense' | 'special_attack' | 'special_defense'> {
        return params.reduce(
            (acc, stat) => {
                switch (stat.stat.name) {
                    case 'hp':
                        acc.hp = stat.base_stat;
                        break;
                    case 'speed':
                        acc.speed = stat.base_stat;
                        break;
                    case 'attack':
                        acc.attack = stat.base_stat;
                        break;
                    case 'defense':
                        acc.defense = stat.base_stat;
                        break;
                    case 'special-attack':
                        acc.special_attack = stat.base_stat;
                        break;
                    case 'special-defense':
                        acc.special_defense = stat.base_stat;
                        break;
                }
                return acc;
            },
            {
                hp: 0,
                speed: 0,
                attack: 0,
                defense: 0,
                special_attack: 0,
                special_defense: 0,
            },
        );
    }

    ensureRelations(response: PokemonByNameResponse): Pick<Pokemon, 'types' | 'moves' | 'abilities'> {
        const types = this.pokemonTypeBusiness.convertPokemonTypes(response.types);
        const moves = response?.moves?.map((move) => new PokemonMove({
            url: move.move.url,
            type: '',
            name: move.move.name,
            target: '',
            effect: '',
            damage_class: '',
            short_effect: '',
        }));
        const abilities = response?.abilities?.map((ability) => new PokemonAbility({
            url: ability.ability.url,
            name: ability.ability.name,
            slot: ability.slot,
            is_hidden: ability.is_hidden,
        }));
        return {
            types,
            moves,
            abilities
        };
    }

    ensureSpecieAttributes(params: PokemonSpecieResponse): EnsureSpecieAttributesResult {
        return {
            habitat: params?.habitat?.name,
            is_baby: params?.is_baby,
            shape_url: params?.shape?.url,
            shape_name: params?.shape?.name,
            is_mythical: params?.is_mythical,
            gender_rate: params?.gender_rate,
            is_legendary: params?.is_legendary,
            capture_rate: params?.capture_rate,
            hatch_counter: params?.hatch_counter,
            base_happiness: params?.base_happiness,
            evolution_chain_url: params?.evolution_chain?.url,
            evolves_from_species: params?.evolves_from_species?.name,
            has_gender_differences: params?.has_gender_differences,
        };
    }

    ensureEvolutions(params?: EvolutionResponse['chain']): Array<string> {
        if(!params) {
            return [];
        }
        return [
            params?.species?.name,
            ...this.ensureNextEvolution(params?.evolves_to)
        ];
    }

    private ensureNextEvolution(params?: EvolutionResponse['chain']['evolves_to']): Array<string> {
        if(!params) {
            return [];
        }
        return params?.map(
            (item) =>
                [item.species.name].concat(...this.ensureNextEvolution(item.evolves_to))
        ).reduce((arr, curr) => [...arr, ...curr], []);
    }
}