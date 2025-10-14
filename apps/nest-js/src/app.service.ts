import { Injectable } from '@nestjs/common';

import BANK_LIST_FIXTURE_JSON from '@repo/mock-json/finance/bank/banks.json';
import BILL_LIST_FIXTURE_JSON from '@repo/mock-json/finance/bill/bills.json';
import EXPENSE_LIST_FIXTURE_JSON from '@repo/mock-json/finance/expense/expenses.json';
import FINANCE_LIST_FIXTURE_JSON from '@repo/mock-json/finance/finances.json';
import GROUP_LIST_FIXTURE_JSON from '@repo/mock-json/finance/group/groups.json';
import INCOME_LIST_FIXTURE_JSON from '@repo/mock-json/finance/income/incomes.json';
import INCOME_SOURCE_LIST_FIXTURE_JSON from '@repo/mock-json/finance/income-source/income-sources.json';
import POKEMON_ABILITY_LIST_FIXTURE_JSON from '@repo/mock-json/pokemon/ability/pokemon-abilities.json';
import POKEMON_LIST_FIXTURE_JSON from '@repo/mock-json/pokemon/pokemons.json';
import POKEMON_MOVE_LIST_FIXTURE_JSON from '@repo/mock-json/pokemon/move/pokemon-moves.json';
import POKEMON_TYPE_LIST_FIXTURE_JSON from '@repo/mock-json/pokemon/type/pokemon-types.json';
import SUPPLIER_LIST_FIXTURE_JSON from '@repo/mock-json/finance/supplier/suppliers.json';
import SUPPLIER_TYPE_LIST_FIXTURE_JSON from '@repo/mock-json/finance/supplier-type/supplier-types.json';
import USER_LIST_FIXTURE_JSON from '@repo/mock-json/auth/users.json';

import { AuthService } from './auth/auth.service';
import { USER_PASSWORD } from './mocks/user.mock';
import { User } from './auth/entities/user.entity';

import { CreateFinanceSeedsDto } from './finance/dto/create-finance-seeds.dto';
import { CreateSeedDto } from './dto/create-seed.dto';
import { FinanceSeederParams } from './finance/types';
import { FinanceService, type FinanceGenerateSeeds  } from './finance/finance.service';

import { CreatePokemonSeedsDto } from './pokemon/dto/create-pokemon-seeds.dto';
import { PokemonSeederParams } from './pokemon/types';
import { PokemonService, type PokemonGenerateSeeds } from './pokemon/pokemon.service';

type SeedsResultItem = {
    list: number;
    added: number;
}

type FinanceSeedsResult = {
    bank: SeedsResultItem;
    bill: SeedsResultItem;
    group: SeedsResultItem;
    months: SeedsResultItem;
    income: SeedsResultItem;
    expense: SeedsResultItem;
    finance: SeedsResultItem;
    supplier: SeedsResultItem;
    incomeSource: SeedsResultItem;
    supplierType: SeedsResultItem;
}

type PokemonSeedsResult = {
    move: SeedsResultItem;
    type: SeedsResultItem;
    ability: SeedsResultItem;
    pokemon: SeedsResultItem;
}

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

    // async seeds(body: CreateSeedDto, user?: User) {
    //     const users: Array<User> = await this.userSeeds(body, user);
    //     if(user) {
    //         users.push(user);
    //     }
    //     return {
    //         users: users.length,
    //         finances: await this.financeSeeds(users, body.finance, user),
    //         pokemons: await this.pokemonSeeds(users, body.pokemon),
    //         message: 'Seeds successfully',
    //     }
    // }

    private async userSeeds(body: CreateSeedDto, user?: User) {
        const users: Array<User> = [];
        const userListFixtureJson = USER_LIST_FIXTURE_JSON as unknown as Array<User>;
        const userLIst = userListFixtureJson.map((item) =>  {
            if(user) {
                item.finance = undefined;
            }
            return item;
        });

        if (body.auth) {
            const auth = await this.authService.seeds(userLIst, USER_PASSWORD) as Array<User>;
            users.push(...auth);
        }

        if (!user && body.finance && users.length === 0) {
            const userFinanceJson = userLIst.find((item) => item['finance'] !== undefined);
            const user = await this.authService.seed(userFinanceJson, USER_PASSWORD) as User;
            users.push(user);
        }

        if(user) {
            users.push(user);
        }

        return users;
    }

    // private async financeSeeds(users: Array<User>, createFinanceSeedsDto?: CreateFinanceSeedsDto, user?: User) {
    //     if (!createFinanceSeedsDto) {
    //         return;
    //     }
    //     const financeSeederParams = this.createFinanceSeederParams(createFinanceSeedsDto);
    //     const {
    //         bills,
    //         groups,
    //         banks,
    //         incomes,
    //         expenses,
    //         finances,
    //         suppliers,
    //         incomeSources,
    //         supplierTypes
    //     } = await this.financeService.seeds({
    //         user,
    //         users,
    //         ...financeSeederParams
    //     })
    //     return {
    //         banks: banks.length,
    //         bills: bills.length,
    //         groups: groups.length,
    //         expenses: expenses.length,
    //         finances: finances.length,
    //         suppliers: suppliers.length,
    //         supplierTypes: supplierTypes.length,
    //         incomes: incomes.length,
    //         incomeSources: incomeSources.length,
    //     }
    // }

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
        if(createFinanceSeedsDto.income) {
            createFinanceSeedsDto.finance = true;
            createFinanceSeedsDto.incomeSource = true;
            financeParams.incomeListJson = INCOME_LIST_FIXTURE_JSON;
        }

        if (createFinanceSeedsDto.expense) {
            createFinanceSeedsDto.bill = true;
            financeParams.expenseListJson = EXPENSE_LIST_FIXTURE_JSON;
        }

        if (createFinanceSeedsDto.bill) {
            createFinanceSeedsDto.bank = true;
            createFinanceSeedsDto.group = true;
            createFinanceSeedsDto.finance = true;
            createFinanceSeedsDto.supplier = true;
            financeParams.billListJson = BILL_LIST_FIXTURE_JSON;
        }

        if (createFinanceSeedsDto.group) {
            createFinanceSeedsDto.finance = true;
            financeParams.groupListJson = GROUP_LIST_FIXTURE_JSON;
        }

        if (createFinanceSeedsDto.supplier) {
            financeParams.supplierListJson = SUPPLIER_LIST_FIXTURE_JSON;
            createFinanceSeedsDto.supplierType = true;
        }

        if(createFinanceSeedsDto.finance) {
            financeParams.financeListJson = FINANCE_LIST_FIXTURE_JSON;
        }

        if (createFinanceSeedsDto.bank) {
            financeParams.bankListJson = BANK_LIST_FIXTURE_JSON;
        }

        if(createFinanceSeedsDto.supplierType) {
            financeParams.supplierTypeListJson = SUPPLIER_TYPE_LIST_FIXTURE_JSON;
        }

        if(createFinanceSeedsDto.incomeSource) {
            financeParams.incomeSourceListJson = INCOME_SOURCE_LIST_FIXTURE_JSON;
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

    // async generateSeeds(body: CreateSeedDto) {
    //     const hasAnySeed = this.hasAnySeed(body);
    //
    //     if (!hasAnySeed) {
    //         return { message: 'No data was selected to generate the Seed.' };
    //     }
    //
    //     const result = this.DEFAULT_SEEDS;
    //
    //     const auth = await this.authService.generateSeed(Boolean(body.auth));
    //     result.auth = {
    //         list: auth.list.length,
    //         added: auth.added.length,
    //     }
    //
    //     if(body.finance) {
    //         result.finance = await this.generateFinanceSeeds(body.finance);
    //     }
    //
    //     return { ...result, message: 'Seed Generate Successfully'};
    // }

    private hasAnySeed(body: CreateSeedDto): boolean {
        return Object.values(body).some(value => {
            if (typeof value === 'object' && value !== null) {
                return Object.values(value).some(v => v);
            }
            return !!value;
        });
    }

    // private async generateFinanceSeeds(seedsDto: CreateFinanceSeedsDto) {
    //     const result = await this.financeService.generateSeeds(seedsDto);
    //     return this.mapperFinanceSeedsResult(result);
    // }

    // async persistSeeds(body: CreateSeedDto) {
    //     const hasAnySeed = this.hasAnySeed(body);
    //
    //     if (!hasAnySeed) {
    //         return { message: 'No data was selected to persist the Seed.' };
    //     }
    //
    //     const result = this.DEFAULT_SEEDS;
    //
    //     if(body.finance) {
    //         result.finance = await this.persistFinanceSeeds(body.finance);
    //     }
    //
    //     const auth = await this.authService.persistSeed(Boolean(body.auth));
    //     result.auth = {
    //         list: auth.list.length,
    //         added: auth.added.length,
    //     }
    //
    //     return { ...result, message: 'Seed Persist Successfully'};
    // }

    // private async persistFinanceSeeds(seedsDto: CreateFinanceSeedsDto) {
    //     const result = await this.financeService.persistSeeds(seedsDto);
    //     return this.mapperFinanceSeedsResult(result);
    // }

    private mapperFinanceSeedsResult(generateSeeds: FinanceGenerateSeeds): FinanceSeedsResult {
        const {
            bills,
            banks,
            months,
            groups,
            incomes,
            expenses,
            finances,
            suppliers,
            supplierTypes,
            incomeSources,
        } = generateSeeds;
        return {
            bill: {
                list: bills.list.length,
                added: bills.added.length
            },
            bank: {
                list: banks.list.length,
                added: banks.added.length
            },
            group: {
                list: groups.list.length,
                added: groups.added.length
            },
            months: {list: months.list.length, added: months.added.length},
            income: {
                list: incomes.list.length,
                added: incomes.added.length
            },
            finance: {
                list: finances.list.length,
                added: finances.added.length
            },
            expense: {
                list: expenses.list.length,
                added: expenses.added.length
            },
            supplier: {
                list: suppliers.list.length,
                added: suppliers.added.length
            },
            supplierType: {
                list: supplierTypes.list.length,
                added: supplierTypes.added.length
            },
            incomeSource: {
                list: incomeSources.list.length,
                added: incomeSources.added.length
            },
        }
    }

    private mapperPokemonSeedsResult(generateSeeds: PokemonGenerateSeeds): PokemonSeedsResult {
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
