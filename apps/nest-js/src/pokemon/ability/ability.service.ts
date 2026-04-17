import { Repository } from 'typeorm';

import POKEMON_ABILITY_LIST_DEVELOPMENT_JSON from '../../../seeds/development/pokemon/abilities.json';
import POKEMON_ABILITY_LIST_PRODUCTION_JSON from '../../../seeds/production/pokemon/abilities.json';
import POKEMON_ABILITY_LIST_STAGING_JSON from '../../../seeds/staging/pokemon/abilities.json';
import { SeedsGenerated, Service } from '../../shared';

import { PokemonAbility } from '../entities/ability.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PokemonAbilityService extends Service<PokemonAbility> {
    constructor(
        @InjectRepository(PokemonAbility)
        protected repository: Repository<PokemonAbility>,
    ) {
        super('pokemon_abilities', [], repository);
    }

    async findList(types?: Array<PokemonAbility>) {
        if(!types) {
            return types;
        }
        return await Promise.all(
            types.map(async (response) =>
                this.queries.findOneByOrder<PokemonAbility>({
                    order: response.order,
                    response,
                    withThrow: false,
                    completingData: (result, response) =>
                        this.completingData(response, result),
                }),
            ),
        );
    }

    private async completingData(
        responseType: PokemonAbility,
        entity?: PokemonAbility,
    ): Promise<PokemonAbility> {
        if (!entity) {
            await this.save(responseType);

            return await this.queries.findOneByOrder({
                order: responseType.order,
                complete: false,
            });
        }

        return entity;
    }

    async seeds(seedsJson?: Array<unknown>) {
        return this.seeder.entities({
            by: 'order',
            key: 'all',
            label: 'Pokemon Abilities',
            seedsJson,
            withReturnSeed: true,
            createdEntityFn: async (item) => item
        })
    }

    async generateSeeds(withSeed: boolean, pokemonSeedsDir: string): Promise<SeedsGenerated<PokemonAbility>> {
        return await this.generateEntitySeeds({
            withSeed,
            seedsDir: pokemonSeedsDir,
            staging: POKEMON_ABILITY_LIST_STAGING_JSON,
            production: POKEMON_ABILITY_LIST_PRODUCTION_JSON,
            development: POKEMON_ABILITY_LIST_DEVELOPMENT_JSON,
            filterGenerateEntityFn: (json, item) => json.order === item.order
        });
    }

    async persistSeeds(withSeed?: boolean): Promise<SeedsGenerated<PokemonAbility>> {
        return await this.seeder.persistEntity({
            withSeed,
            staging: POKEMON_ABILITY_LIST_STAGING_JSON,
            production: POKEMON_ABILITY_LIST_PRODUCTION_JSON,
            development: POKEMON_ABILITY_LIST_DEVELOPMENT_JSON,
        });
    }
}