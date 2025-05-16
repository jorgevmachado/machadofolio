import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { EStatus } from '@repo/business/enum';

import { PaginateParameters } from '@repo/business/paginate/types';
import { PokeApiService } from '@repo/business/pokemon/poke-api/service/service';

import { type FindOneByParams, ListParams, Service } from '../shared';

import { Pokemon } from './entities/pokemon.entity';
import { PokemonAbilityService } from './ability/ability.service';
import { PokemonMoveService } from './move/move.service';
import { PokemonTypeService } from './type/type.service';

@Injectable()
export class PokemonService extends Service<Pokemon> {
    constructor(
        @InjectRepository(Pokemon)
        protected repository: Repository<Pokemon>,
        protected pokeApiService: PokeApiService,
        protected pokemonMoveService: PokemonMoveService,
        protected pokemonTypeService: PokemonTypeService,
        protected pokemonAbilityService: PokemonAbilityService,
    ) {
        super('pokemons', ['moves', 'types', 'abilities', 'evolutions'], repository);
    }

    async findAll(listParams: ListParams): Promise<Array<Pokemon> | PaginateParameters<Pokemon>> {
        await this.validateDatabase();
        return await this.queries.list(listParams);
    }

    private async createList(list: Array<Pokemon>) {
        return Promise.all(list.map((item: Pokemon) => this.save(item)))
            .then()
            .catch((error) => this.error(error));
    }

    private async validateDatabase(): Promise<void> {
        const total = await this.repository.count();

        if (total !== this.pokeApiService.limit) {
            const externalPokemonList = await this.pokeApiService
                .getAll({})
                .then((response) => response)
                .catch((error) => {
                    throw this.error(error);
                });
            if (total === 0) {
                return this.createList(externalPokemonList);
            }

            const entities = (await this.repository.find()) ?? [];

            const saveList = externalPokemonList.filter(
                (item) => !entities.find((database) => database.name === item.name),
            );

            return this.createList(saveList);
        }
    }

    async findOne(findOneByParams: FindOneByParams) {
        return await this.validateEntity(findOneByParams.value);
    }

    async validateEntity(value: string, complete: boolean = true){
        const result = await this.queries.findOne({ value });
        if(!result) {
            return result;
        }
        if(result?.status === EStatus.COMPLETE) {
            return result;
        }

        if(!complete) {
            return result;
        }

        return this.completingPokemonData(result);
    }

    private async completingPokemonData(result: Pokemon){
        const entity = await this.pokeApiService.getByName(result);
        entity.moves = await this.pokemonMoveService.findList(entity?.moves);
        entity.types = await this.pokemonTypeService.findList(entity?.types);
        entity.abilities = await this.pokemonAbilityService.findList(entity?.abilities);
        entity.evolutions = await this.findEvolutions(entity.evolution_chain_url);
        entity.status = EStatus.COMPLETE;
        await this.save(entity);
        return await this.validateEntity(entity.name, false);
    }

    private async findEvolutions(url?: string): Promise<Array<Pokemon> | undefined> {
        if(!url) {
            return;
        }
        const response = await this.pokeApiService.getEvolutions(url);
        const result = await Promise.all(
            response
                .map(async (name) => await this.validateEntity(name, false))
        )
        return result?.filter((value) => value !== undefined)
    }
}
