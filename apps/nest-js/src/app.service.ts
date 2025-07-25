import { Injectable } from '@nestjs/common';

import USER_LIST_FIXTURE_JSON from '@repo/mock-json/auth/users.json';

import BANK_LIST_FIXTURE_JSON from '@repo/mock-json/finance/bank/banks.json';
import BILL_LIST_FIXTURE_JSON from '@repo/mock-json/finance/bill/bills.json';
import EXPENSE_LIST_FIXTURE_JSON from '@repo/mock-json/finance/expense/expenses.json';
import FINANCE_LIST_FIXTURE_JSON from '@repo/mock-json/finance/finances.json';
import GROUP_LIST_FIXTURE_JSON from '@repo/mock-json/finance/group/groups.json';
import SUPPLIER_LIST_FIXTURE_JSON from '@repo/mock-json/finance/supplier/suppliers.json';
import SUPPLIER_TYPE_LIST_FIXTURE_JSON from '@repo/mock-json/finance/supplier-type/supplier-types.json';

import POKEMON_ABILITY_LIST_FIXTURE_JSON from '@repo/mock-json/pokemon/ability/pokemon-abilities.json';
import POKEMON_LIST_FIXTURE_JSON from '@repo/mock-json/pokemon/pokemons.json';
import POKEMON_MOVE_LIST_FIXTURE_JSON from '@repo/mock-json/pokemon/move/pokemon-moves.json';
import POKEMON_TYPE_LIST_FIXTURE_JSON from '@repo/mock-json/pokemon/type/pokemon-types.json';

import { AuthService } from './auth/auth.service';
import { USER_PASSWORD } from './mocks/user.mock';
import { User } from './auth/entities/user.entity';

import { CreateFinanceSeedsDto } from './finance/dto/create-finance-seeds.dto';
import { CreateSeedDto } from './dto/create-seed.dto';
import { FinanceSeederParams } from './finance/types';
import { FinanceService } from './finance/finance.service';

import { CreatePokemonSeedsDto } from './pokemon/dto/create-pokemon-seeds.dto';
import { PokemonSeederParams } from './pokemon/types';
import { PokemonService } from './pokemon/pokemon.service';

@Injectable()
export class AppService {
    constructor(
        private authService: AuthService,
        private financeService: FinanceService,
        private pokemonService: PokemonService
    ) {
    }

    async seeds(body: CreateSeedDto) {
        const users: Array<User> = await this.userSeeds(body);
        return {
            users: users.length,
            finances: await this.financeSeeds(users, body.finance),
            pokemons: await this.pokemonSeeds(users, body.pokemon),
            message: 'Seeds successfully',
        }
    }

    private async userSeeds(body: CreateSeedDto) {
        const users: Array<User> = [];

        if (body.auth) {
            const auth = await this.authService.seeds(USER_LIST_FIXTURE_JSON, USER_PASSWORD) as Array<User>;
            users.push(...auth);
        }

        if (body.finance && users.length === 0) {
            const userFinanceJson = USER_LIST_FIXTURE_JSON.find((item) => item['finance'] !== undefined);
            const user = await this.authService.seed(userFinanceJson, USER_PASSWORD) as User;
            users.push(user);
        }

        return users;
    }

    private async financeSeeds(users: Array<User>, createFinanceSeedsDto?: CreateFinanceSeedsDto) {
        if (!createFinanceSeedsDto) {
            return;
        }
        const financeSeederParams = this.createFinanceSeederParams(createFinanceSeedsDto);
        const {
            bills,
            groups,
            banks,
            expenses,
            finances,
            suppliers,
            supplierTypes
        } = await this.financeService.seeds({
            users,
            ...financeSeederParams
        })
        return {
            bills: bills.length,
            groups: groups.length,
            banks: banks.length,
            expenses: expenses.length,
            finances: finances.length,
            suppliers: suppliers.length,
            supplierTypes: supplierTypes.length,
        }
    }

    private async pokemonSeeds(users: Array<User>, createPokemonSeedsDto?:CreatePokemonSeedsDto) {
        if(!createPokemonSeedsDto) {
            return;
        }
        const pokemonSeederParams = this.createPokemonSeederParams(createPokemonSeedsDto);

        const {
            moves,
            types,
            abilities,
            pokemons,
        } = await this.pokemonService.seeds({
            users,
            ...pokemonSeederParams
        })
        return {
            moves: moves.length,
            types: types.length,
            abilities: abilities.length,
            pokemons: pokemons.length,
        }
    }

    private createFinanceSeederParams(createFinanceSeedsDto: CreateFinanceSeedsDto) {
        const financeParams: FinanceSeederParams = {};
        if(createFinanceSeedsDto.finance) {
            financeParams.financeListJson = FINANCE_LIST_FIXTURE_JSON;
        }

        if (createFinanceSeedsDto.expense) {
            createFinanceSeedsDto.bill = true;
            financeParams.expenseListJson = EXPENSE_LIST_FIXTURE_JSON;
        }

        if (createFinanceSeedsDto.bill) {
            createFinanceSeedsDto.bank = true;
            createFinanceSeedsDto.group = true;
            createFinanceSeedsDto.supplier = true;
            financeParams.billListJson = BILL_LIST_FIXTURE_JSON;
        }

        if (createFinanceSeedsDto.bank) {
            financeParams.bankListJson = BANK_LIST_FIXTURE_JSON;
        }

        if (createFinanceSeedsDto.supplier) {
            financeParams.supplierListJson = SUPPLIER_LIST_FIXTURE_JSON;
            financeParams.supplierTypeListJson = SUPPLIER_TYPE_LIST_FIXTURE_JSON;
        }

        if (createFinanceSeedsDto.group) {
            financeParams.groupListJson = GROUP_LIST_FIXTURE_JSON;
        }
        return financeParams;
    }

    private createPokemonSeederParams(createPokemonSeedsDto: CreatePokemonSeedsDto) {
        const pokemonSeederParams: PokemonSeederParams = {}

        if(createPokemonSeedsDto.pokemon) {
            pokemonSeederParams.listJson = POKEMON_LIST_FIXTURE_JSON;
        }

        if(createPokemonSeedsDto.move) {
            pokemonSeederParams.moveListJson = POKEMON_MOVE_LIST_FIXTURE_JSON;
        }

        if(createPokemonSeedsDto.type) {
            pokemonSeederParams.typeListJson = POKEMON_TYPE_LIST_FIXTURE_JSON;
        }

        if(createPokemonSeedsDto.ability) {
            pokemonSeederParams.abilityListJson = POKEMON_ABILITY_LIST_FIXTURE_JSON;
        }
        return pokemonSeederParams;
    }
}
