import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { PokeApiService } from '@repo/business';

import { Service } from '../../shared';

import { PokemonMove } from '../entities/move.entity';

@Injectable()
export class PokemonMoveService extends Service<PokemonMove> {
    constructor(
        @InjectRepository(PokemonMove)
        protected repository: Repository<PokemonMove>,
        protected pokeApiService: PokeApiService,
    ) {
        super('pokemon_moves', [], repository);
    }


    async findList(moves?: Array<PokemonMove>) {
        if(!moves) {
            return moves;
        }
        return await Promise.all(
            moves?.map(async (move) => this.queries.findOneByOrder<PokemonMove>({
                order: move.order,
                response: move,
                withThrow: false,
                completingData: (result, response) => this.completingData(response, result)
            }))
        );
    }

    private async completingData(response: PokemonMove, entity?: PokemonMove) {
        if(!entity) {
            const move = await this
                .pokeApiService
                .move
                .getOne(response)
                .then((response) => response)
                .catch((error) => this.error(error));

            await this.save(move);
            return await this.queries.findOneByOrder({ order: move.order, complete: false });
        }
        return entity;
    }

    async seeds(seedsJson?: Array<unknown>) {
        return this.seeder.entities({
            by: 'order',
            key: 'all',
            label: 'Pokemon Moves',
            seedsJson,
            withReturnSeed: true,
            createdEntityFn: async (item) => item
        })
    }
}
