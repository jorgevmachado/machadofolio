import { Injectable } from '@nestjs/common';

import POKEMON_ABILITY_LIST_FIXTURE_JSON from '@repo/mock-json/pokemon/ability/pokemon-abilities.json';
import POKEMON_LIST_FIXTURE_JSON from '@repo/mock-json/pokemon/pokemons.json';
import POKEMON_MOVE_LIST_FIXTURE_JSON from '@repo/mock-json/pokemon/move/pokemon-moves.json';
import POKEMON_TYPE_LIST_FIXTURE_JSON from '@repo/mock-json/pokemon/type/pokemon-types.json';

import { AuthService } from './auth/auth.service';
import { CreateSeedDto } from './dto/create-seed.dto';
import { FinanceService } from './finance/finance.service';

import { CreatePokemonSeedsDto } from './pokemon/dto/create-pokemon-seeds.dto';
import type { PokemonSeederParams, GeneratedPokemonSeeds, PokemonSeedsResult } from './pokemon/types';
import { PokemonService } from './pokemon/pokemon.service';
import { FinanceSeedsResult } from './finance/types';
import { SeedsResultItem } from './shared';


type SeedsResult = {
    auth: SeedsResultItem;
    finance: FinanceSeedsResult;
    pokemon: PokemonSeedsResult;
}

@Injectable()
export class AppService {
    private DEFAULT_SEEDS: SeedsResult = {
        auth: {
            list: 0,
            added: 0
        },
        finance: {
            bill: {
                list: 0,
                added: 0
            },
            bank: {
                list: 0,
                added: 0
            },
            group: {
                list: 0,
                added: 0
            },
            months: {
                list: 0,
                added: 0
            },
            income: {
                list: 0,
                added: 0
            },
            finance: {
                list: 0,
                added: 0
            },
            expense: {
                list: 0,
                added: 0
            },
            supplier: {
                list: 0,
                added: 0
            },
            supplierType: {
                list: 0,
                added: 0
            },
            incomeSource: {
                list: 0,
                added: 0
            },
        },
        pokemon: {
            move: {
                list: 0,
                added: 0
            },
            type: {
                list: 0,
                added: 0
            },
            ability: {
                list: 0,
                added: 0
            },
            pokemon: {
                list: 0,
                added: 0
            },
        }
    };

    constructor(
        private authService: AuthService,
        private financeService: FinanceService,
        private pokemonService: PokemonService
    ) {
    }

    private createPokemonSeederParams(createPokemonSeedsDto: CreatePokemonSeedsDto) {
        const pokemonSeederParams: PokemonSeederParams = {}

        if (createPokemonSeedsDto.pokemon) {
            pokemonSeederParams.listJson = POKEMON_LIST_FIXTURE_JSON;
        }

        if (createPokemonSeedsDto.move) {
            pokemonSeederParams.moveListJson = POKEMON_MOVE_LIST_FIXTURE_JSON;
        }

        if (createPokemonSeedsDto.type) {
            pokemonSeederParams.typeListJson = POKEMON_TYPE_LIST_FIXTURE_JSON;
        }

        if (createPokemonSeedsDto.ability) {
            pokemonSeederParams.abilityListJson = POKEMON_ABILITY_LIST_FIXTURE_JSON;
        }
        return pokemonSeederParams;
    }

    async generateSeeds(body: CreateSeedDto) {
        const hasAnyParamToGenerateSeed = this.hasAnyParamToGenerateSeed(body);

        if (!hasAnyParamToGenerateSeed) {
            return { message: 'No data was selected to generate the Seed.' };
        }

        const result = this.DEFAULT_SEEDS;

        const auth = await this.authService.generateSeed(Boolean(body.auth));
        result.auth = {
            list: auth.list.length,
            added: auth.added.length,
        }

        if (body.finance) {
            result.finance = await this.financeService.generateSeeds(body.finance);
        }

        return { ...result, message: 'Seed Generate Successfully' };
    }

    async persistSeeds(body: CreateSeedDto) {
        const hasAnySeed = this.hasAnyParamToGenerateSeed(body);

        if (!hasAnySeed) {
            return { message: 'No data was selected to persist the Seed.' };
        }

        const result = this.DEFAULT_SEEDS;

        if (body.finance) {
            result.finance = await this.financeService.persistSeeds(body.finance);
        }

        const auth = await this.authService.persistSeed(Boolean(body.auth));
        result.auth = {
            list: auth.list.length,
            added: auth.added.length,
        }

        return { ...result, message: 'Seed Persist Successfully' };
    }

    private hasAnyParamToGenerateSeed(body: CreateSeedDto): boolean {
        return Object.values(body).some(value => {
            if (typeof value === 'object' && value !== null) {
                return Object.values(value).some(v => v);
            }
            return !!value;
        });
    }

    private mapperPokemonSeedsResult(generateSeeds: GeneratedPokemonSeeds): PokemonSeedsResult {
        const {
            types,
            moves,
            pokemons,
            abilities,
        } = generateSeeds;

        return {
            type: {
                list: types.list.length,
                added: types.added.length
            },
            move: {
                list: moves.list.length,
                added: moves.added.length
            },
            ability: {
                list: abilities.list.length,
                added: abilities.added.length
            },
            pokemon: {
                list: pokemons.list.length,
                added: pokemons.added.length
            },
        }
    }
}
