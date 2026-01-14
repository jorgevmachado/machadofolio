import { AuthService ,Nest ,PokemonService  } from '@repo/business';

import { getAccessToken } from '../cookies';

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const token = getAccessToken() || '';

const nest = new Nest({
  token ,
  baseUrl ,
});

export const authService = new AuthService(nest);
export const pokemonService = new PokemonService(nest);