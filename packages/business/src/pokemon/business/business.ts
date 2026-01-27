import { EStatus } from '../../enum';

import type Pokemon from '../pokemon';

export default class PokemonBusiness {
  public firstTrainerPokemon(pokemons: Array<Pokemon>, pokemonName: string): Pokemon | undefined {
    if(pokemons.length === 0) {
      return;
    }

    const pokemon = pokemons.find((pokemon) => pokemon.name === pokemonName);
    if(pokemon) {
      return pokemon;
    }
    const pokemonComplete = pokemons.find((pokemon) => pokemon.status === EStatus.COMPLETE);
    if(pokemonComplete) {
      return pokemonComplete;
    }
    const orders = pokemons.map(({ order }) => order);
    const randomOrder = orders[Math.floor(Math.random() * orders.length)];
    return pokemons.find((pokemon) => pokemon.order === randomOrder) as Pokemon;
  }
}