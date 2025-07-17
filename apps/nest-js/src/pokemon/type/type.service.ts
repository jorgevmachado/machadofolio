import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Service } from '../../shared';

import { PokemonType } from '../entities/type.entity';

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

    async completingData(
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
}

