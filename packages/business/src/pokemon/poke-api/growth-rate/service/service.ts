import { type PokeApi } from '../../../../api';
import { PokemonGrowthRate } from '../../../growth-rate';

export class PokeApiGrowthRateService {

    constructor(private pokeApi: PokeApi) {}

    async getOne(growthRate: PokemonGrowthRate): Promise<PokemonGrowthRate> {
        return this.pokeApi.growthRate.getByOrder(growthRate.order).then((response) => {
            return new PokemonGrowthRate({
                ...growthRate,
                formula: response?.formula ?? ''
            });
        });
    }

}
