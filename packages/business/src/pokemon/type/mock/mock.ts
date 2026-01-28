import { type PokemonTypeEntity } from '../types';

export const POKEMON_TYPE_MOCK: PokemonTypeEntity = {
    id: 'f73f900d-1e0e-4a39-be7a-509746164ae9',
    url: 'https://pokemon-mock/type/1/',
    name: 'type',
    order: 1,
    text_color: '#FFF',
    weaknesses: [{
      id: 'd6db6f9e-a62c-4ddc-b447-52e6a620046a',
      url: 'https://pokemon-mock/type/2/',
      name: 'type',
      order: 2,
      text_color: '#FFF',
      weaknesses: [],
      created_at: new Date('2025-02-06T18:26:04.618Z'),
      updated_at: new Date('2025-02-06T18:26:04.618Z'),
      deleted_at: undefined,
      background_color: '#000'
    }],
    created_at: new Date('2025-02-06T18:26:04.618Z'),
    updated_at: new Date('2025-02-06T18:26:04.618Z'),
    deleted_at: undefined,
    background_color: '#000'
};