import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Service } from '../../shared';

import { PokemonAbility } from '../entities/ability.entity';

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

    async generateSeeds(withSeed: boolean, pokemonSeedsDir: string) {
        console.log('# => pokemonSeedsDir => ', pokemonSeedsDir);
        if(!withSeed) {
            return {
                list: [],
                added: [],
            };
        }
        return {
            list: [],
            added: [],
        };
    }

    async persistSeeds(withSeed?: boolean) {
        if(!withSeed) {
            return {
                list: [],
                added: [],
            };
        }
        return {
            list: [],
            added: [],
        };
    }
}

