import POKEMON_TYPE_LIST_DEVELOPMENT_JSON from '../../../seeds/development/pokemon/types.json';
import POKEMON_TYPE_LIST_PRODUCTION_JSON from '../../../seeds/production/pokemon/types.json';
import POKEMON_TYPE_LIST_STAGING_JSON from '../../../seeds/staging/pokemon/types.json';
import { SeedsGenerated, Service } from '../../shared';

import { PokemonType } from '../entities/type.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class PokemonTypeService extends Service<PokemonType> {
    constructor(
        @InjectRepository(PokemonType)
        protected repository: Repository<PokemonType>,
    ) {
        super('pokemon_types', [], repository);
    }

    async findList(types?: Array<PokemonType>) {
        if(!types) {
            return  types;
        }
        return await Promise.all(
            types?.map(async (response) =>
                this.queries.findOneByOrder<PokemonType>({
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
        responseType: PokemonType,
        entity?: PokemonType,
    ): Promise<PokemonType> {
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
            label: 'Pokemon Types',
            seedsJson,
            withReturnSeed: true,
            createdEntityFn: async (item) => item
        })
    }

    async generateSeeds(withSeed: boolean, pokemonSeedsDir: string): Promise<SeedsGenerated<PokemonType>> {
        return await this.generateEntitySeeds({
            withSeed,
            seedsDir: pokemonSeedsDir,
            staging: POKEMON_TYPE_LIST_STAGING_JSON,
            production: POKEMON_TYPE_LIST_PRODUCTION_JSON,
            development: POKEMON_TYPE_LIST_DEVELOPMENT_JSON,
            filterGenerateEntityFn: (json, item) => json.order === item.order
        });
    }

    async persistSeeds(withSeed?: boolean): Promise<SeedsGenerated<PokemonType>> {
        return await this.seeder.persistEntity({
            withSeed,
            staging: POKEMON_TYPE_LIST_STAGING_JSON,
            production: POKEMON_TYPE_LIST_PRODUCTION_JSON,
            development: POKEMON_TYPE_LIST_DEVELOPMENT_JSON,
        });
    }
}