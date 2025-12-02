import { EStatus } from '@repo/business';
import { type PaginateParameters, PokeApiService } from '@repo/business';

import { type FindOneByParams, ListParams, SeedsGenerated, Service } from '../shared';

import { PokemonAbilityService } from './ability/ability.service';
import { CreatePokemonSeedsDto } from './dto/create-pokemon-seeds.dto';
import { PokemonAbility } from './entities/ability.entity';
import { PokemonMove } from './entities/move.entity';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonType } from './entities/type.entity';
import { PokemonMoveService } from './move/move.service';
import { PokemonTypeService } from './type/type.service';
import type { PokemonSeederParams, PokemonSeedsResult } from './types';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export type PokemonGenerateSeeds = {
    type: SeedsGenerated<PokemonType>;
    move: SeedsGenerated<PokemonMove>;
    ability: SeedsGenerated<PokemonAbility>;
    pokemon: SeedsGenerated<Pokemon>;
}

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

    private readonly DEFAULT_SEEDS_RESULT: PokemonGenerateSeeds = {
        type: {
            list: [],
            added: []
        },
        move: {
            list: [],
            added: []
        },
        ability: {
            list: [],
            added: []
        },
        pokemon: {
            list: [],
            added: []
        },
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
                await this.createList(externalPokemonList);
                return;
            }

            const entities = (await this.repository.find()) ?? [];

            const saveList = externalPokemonList.filter(
                (item) => !entities.find((database) => database.name === item.name),
            );

            await this.createList(saveList);
        }
    }

    async findOne(findOneByParams: FindOneByParams) {
        return await this.validateEntity(findOneByParams.value);
    }

    private async validateEntity(value: string, complete: boolean = true){
        const result = await this.queries.findOne({ value, withRelations: true });

        if(result?.status === EStatus.COMPLETE) {
            return result;
        }

        if(!complete) {
            return result;
        }

        return this.completingPokemonData(result as Pokemon);
    }

    async seeds(pokemonSeederParams: PokemonSeederParams) {
        const moves: Array<PokemonMove> = await this.seeder.executeSeed<PokemonMove>({
            label: 'Moves',
            seedMethod: async () => {
                const result = await this.pokemonMoveService.seeds(pokemonSeederParams?.moveListJson);
                return Array.isArray(result) ? result : [];
            }
        });

        const types: Array<PokemonType> = await this.seeder.executeSeed<PokemonType>({
            label: 'Types',
            seedMethod: async () => {
                const result = await this.pokemonTypeService.seeds(pokemonSeederParams?.typeListJson);
                return Array.isArray(result) ? result : [];
            }
        });

        const abilities: Array<PokemonAbility> = await this.seeder.executeSeed<PokemonAbility>({
            label: 'Abilities',
            seedMethod: async () => {
                const result = await this.pokemonAbilityService.seeds(pokemonSeederParams?.abilityListJson);
                return Array.isArray(result) ? result : [];
            }
        });

        const list = await this.seeder.entities({
            by: 'name',
            key: 'all',
            label: 'Pokemon',
            seedsJson: pokemonSeederParams?.listJson,
            withReturnSeed: true,
            createdEntityFn: async (entity) => {
                if(entity.moves) {
                    entity.moves = moves?.filter((move) => entity?.moves?.find(item => item.id === move.id));
                }
                if(entity.types) {
                    entity.types = types?.filter((type) => entity?.types?.find(item => item.id === type.id));
                }
                if(entity.abilities) {
                    entity.abilities = abilities?.filter((ability) => entity?.abilities?.find(item => item.id === ability.id));
                }
                entity.evolutions = undefined;
                return entity;
            }
        }) as Array<Pokemon>;

        const seeds = this.seeder.currentSeeds<Pokemon>({ seedsJson: pokemonSeederParams?.listJson });

        const pokemons = await Promise.all(
            list?.map(async (item) => {
                if (!item?.evolutions) {
                    const currentPokemon = seeds.find((seed) => seed.name === item.name);
                    if (!currentPokemon || !currentPokemon?.evolutions) {
                        return item;
                    }
                    const evolutions = list?.filter((pokemon) => currentPokemon?.evolutions?.find((item) => item.name === pokemon.name));
                    return await this.save({ ...item, evolutions });
                }
                return item;
            })
        )

        return {
            moves,
            types,
            abilities,
            pokemons,
        }
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

    async generateSeeds(createPokemonSeedsDto: CreatePokemonSeedsDto): Promise<PokemonSeedsResult> {
        const seedsDto = this.validatePokemonSeedsDto(createPokemonSeedsDto);
        const result: PokemonGenerateSeeds = this.DEFAULT_SEEDS_RESULT;

        const rootSeedsDir = this.file.getSeedsDirectory();
        const pokemonSeedsDir = this.file.createDirectory('pokemon', rootSeedsDir);

        result.move = await this.pokemonMoveService.generateSeeds(Boolean(seedsDto.move), pokemonSeedsDir);
        result.type = await this.pokemonTypeService.generateSeeds(Boolean(seedsDto.move), pokemonSeedsDir);
        result.ability = await this.pokemonAbilityService.generateSeeds(Boolean(seedsDto.move), pokemonSeedsDir);

        result.pokemon = await this.generateSeed(Boolean(seedsDto.pokemon), pokemonSeedsDir);

        return this.mapperPokemonSeedsResult(result);
    }

    async persistSeeds(createPokemonSeedsDto: CreatePokemonSeedsDto): Promise<PokemonSeedsResult> {
        const seedsDto = this.validatePokemonSeedsDto(createPokemonSeedsDto);
        const result: PokemonGenerateSeeds = this.DEFAULT_SEEDS_RESULT;

        result.move = await this.pokemonMoveService.persistSeeds(Boolean(seedsDto.move));
        result.type = await this.pokemonTypeService.persistSeeds(Boolean(seedsDto.move));
        result.ability = await this.pokemonAbilityService.persistSeeds(Boolean(seedsDto.move));

        result.pokemon = await this.persistSeed(Boolean(seedsDto.pokemon));

        return this.mapperPokemonSeedsResult(result);
    }

    private async generateSeed(withSeed: boolean, pokemonSeedsDir: string): Promise<SeedsGenerated<Pokemon>>{
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
        }
    }

    private async persistSeed(withSeed: boolean): Promise<SeedsGenerated<Pokemon>>{
        if(!withSeed) {
            return {
                list: [],
                added: [],
            };
        }
        return {
            list: [],
            added: [],
        }
    }

    validatePokemonSeedsDto(createPokemonSeedsDto: CreatePokemonSeedsDto):CreatePokemonSeedsDto {
        const seedsDto = { ...createPokemonSeedsDto };
        if(createPokemonSeedsDto.pokemon) {
            seedsDto.move = true;
            seedsDto.type = true;
            seedsDto.ability = true;
        }
        return seedsDto;
    }

    private mapperPokemonSeedsResult(generateSeeds: PokemonGenerateSeeds): PokemonSeedsResult {
        const {
            type,
            move,
            ability,
            pokemon,
        } = generateSeeds;
        return {
            type: {
                list: type.list.length,
                added: type.added.length
            },
            move: {
                list: move.list.length,
                added: move.added.length
            },
            ability: {
                list: ability.list.length,
                added: ability.added.length
            },
            pokemon: {
                list: pokemon.list.length,
                added: pokemon.added.length
            },
        };
    }
}