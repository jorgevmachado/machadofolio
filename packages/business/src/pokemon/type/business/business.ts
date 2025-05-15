import { extractLastNumberFromUrl } from '@repo/services/number/number';

import type { PokemonByNameResponse } from '../../poke-api';

import PokemonType from '../type';

import type { EnsureColorParams, EnsureColorResult, TypeColor } from './types';




const TYPE_COLORS: Array<TypeColor> = [
    { id: 1, name: 'ice', text_color: '#fff', background_color: '#51c4e7' },
    { id: 2, name: 'bug', text_color: '#b5d7a7', background_color: '#482d53' },
    { id: 3, name: 'fire', text_color: '#fff', background_color: '#ff2400' },
    { id: 4, name: 'rock', text_color: '#fff', background_color: '#a38c21' },
    { id: 5, name: 'dark', text_color: '#fff', background_color: '#707070' },
    { id: 6, name: 'steel', text_color: '#fff', background_color: '#9eb7b8' },
    { id: 7, name: 'ghost', text_color: '#fff', background_color: '#7b62a3' },
    { id: 8, name: 'fairy', text_color: '#cb3fa0', background_color: '#c8a2c8' },
    { id: 9, name: 'water', text_color: '#fff', background_color: '#72c8dd' },
    { id: 10, name: 'grass', text_color: '#8b4513', background_color: '#b9cc50' },
    { id: 11, name: 'normal', text_color: '#000', background_color: '#fff' },
    { id: 12, name: 'dragon', text_color: '#fff', background_color: '#FF8C00' },
    {
        id: 13,
        name: 'poison',
        text_color: '#f5f5f5',
        background_color: '#8b008b',
    },
    {
        id: 14,
        name: 'flying',
        text_color: '#424242',
        background_color: '#3dc7ef',
    },
    {
        id: 15,
        name: 'ground',
        text_color: '#f5f5f5',
        background_color: '#bc5e00',
    },
    { id: 16, name: 'psychic', text_color: '#fff', background_color: '#f366b9' },
    {
        id: 17,
        name: 'electric',
        text_color: '#0000ff',
        background_color: '#ffff40',
    },
    { id: 18, name: 'fighting', text_color: '#fff', background_color: '#d56723' },
];

export default class PokemonTypeBusiness {
    convertPokemonTypes(types: PokemonByNameResponse['types']): Array<PokemonType> {
        return types?.map((type) => this.convertPokemonType(type)) ?? [];
    }

    private convertPokemonType(type: PokemonByNameResponse['types'][number]): PokemonType {
        const url = type.type.url;
        const order = extractLastNumberFromUrl(url);
        const name = type.type.name;
        return new PokemonType({
            order,
            name,
            url,
            ...this.ensureColor({ name })
        });
    }

    ensureColor(params: EnsureColorParams): EnsureColorResult {
        const { text_color = '#FFF', background_color = '#000' } = TYPE_COLORS.find((color) => color.name === params.name) ?? {};
        return {
            text_color: params?.text_color ?? text_color,
            background_color: params?.background_color ?? background_color,
        };
    }
}