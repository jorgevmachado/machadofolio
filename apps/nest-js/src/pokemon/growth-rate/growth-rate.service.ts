import { Repository } from 'typeorm';

import { PokeApiService } from '@repo/business';

import { Service } from '../../shared';

import { PokemonGrowthRate } from '../entities/growth-rate.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PokemonGrowthRateService extends Service<PokemonGrowthRate> {
  constructor(
    @InjectRepository(PokemonGrowthRate)
    protected repository: Repository<PokemonGrowthRate> ,
    protected pokeApiService: PokeApiService ,
  ) {
    super('pokemon_growth_rates' ,[] ,repository);
  }

  async find(growthRate?: PokemonGrowthRate) {
    if (!growthRate) {
      return undefined;
    }
    return await this.queries.findOneByOrder<PokemonGrowthRate>({
      order: growthRate.order ,
      response: growthRate ,
      withThrow: false ,
      completingData: (result ,response) => this.completingData(response ,
        result),
    });
  }

  private async completingData(
    response: PokemonGrowthRate ,entity?: PokemonGrowthRate) {
    if (!entity) {
      const growthRate = await this.pokeApiService.growthRate.getOne(response).
      then((response) => response).
      catch((error) => this.error(error));

      await this.save(growthRate);
      return await this.queries.findOneByOrder(
        { order: growthRate.order ,complete: false });
    }
    return entity;
  }
}