import { type PokeApi } from '../../../../api';
import { PokemonGrowthRate } from '../../../growth-rate';

export class PokeApiGrowthRateService {

    constructor(private pokeApi: PokeApi) {}

    async getByUrl(url: string): Promise<PokemonGrowthRate> {
        return this.pokeApi.growthRate.getByUrl(url).then((response) => {
            return new PokemonGrowthRate({
                url,
                name: response?.name,
                order: response?.id,
                formula: response?.formula
            });
        });
    }

}
