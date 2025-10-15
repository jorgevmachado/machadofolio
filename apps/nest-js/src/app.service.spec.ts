import { type PokemonSeederParams } from './pokemon/types';


jest.mock('./auth/auth.service', () => {
    class AuthServiceMock {
        seed = jest.fn();
        seeds = jest.fn();
    }
    return { AuthService: AuthServiceMock }
});

jest.mock('./finance/finance.service', () => {
    class FinanceServiceMock {
        seeds = jest.fn();
    }
    return { FinanceService: FinanceServiceMock }
});

jest.mock('./pokemon/pokemon.service', () => {
    class PokemonServiceMock {
        seeds = jest.fn();
    }
    return { PokemonService: PokemonServiceMock }
});

import { BANK_MOCK } from './mocks/bank.mock';
import { BILL_MOCK } from './mocks/bill.mock';
import { EXPENSE_MOCK } from './mocks/expense.mock';
import { FINANCE_MOCK } from './mocks/finance.mock';
import { GROUP_MOCK } from './mocks/group.mock';
import { INCOME_MOCK } from './mocks/income.mock';
import { INCOME_SOURCE_MOCK } from './mocks/income-source.mock';
import { POKEMON_ABILITY_MOCK } from './pokemon/mocks/ability.mock';
import { POKEMON_MOCK } from './pokemon/mocks/pokemon';
import { POKEMON_MOVE_MOCK } from './pokemon/mocks/move.mock';
import { POKEMON_TYPE_MOCK } from './pokemon/mocks/type';
import { SUPPLIER_MOCK } from './mocks/supplier.mock';
import { SUPPLIER_TYPE_MOCK } from './mocks/supplier-type.mock';
import { USER_MOCK } from './mocks/user.mock';

jest.mock('@repo/mock-json/auth/users.json', () => [USER_MOCK]);
jest.mock('@repo/mock-json/finance/bank/banks.json', () => [BANK_MOCK]);
jest.mock('@repo/mock-json/finance/bill/bills.json', () => [BILL_MOCK]);
jest.mock('@repo/mock-json/finance/expense/expenses.json', () => [EXPENSE_MOCK]);
jest.mock('@repo/mock-json/finance/finances.json', () => [FINANCE_MOCK]);
jest.mock('@repo/mock-json/finance/group/groups.json', () => [GROUP_MOCK]);
jest.mock('@repo/mock-json/finance/supplier/suppliers.json', () => [SUPPLIER_MOCK]);
jest.mock( '@repo/mock-json/finance/supplier-type/supplier-types.json', () => [SUPPLIER_TYPE_MOCK]);
jest.mock( '@repo/mock-json/finance/income/incomes.json', () => [INCOME_MOCK]);
jest.mock( '@repo/mock-json/finance/income-source/income-sources.json', () => [INCOME_SOURCE_MOCK]);

jest.mock('@repo/mock-json/pokemon/ability/pokemon-abilities.json', () => [POKEMON_ABILITY_MOCK]);
jest.mock('@repo/mock-json/pokemon/pokemons.json', () => [POKEMON_MOCK]);
jest.mock('@repo/mock-json/pokemon/move/pokemon-moves.json', () => [POKEMON_MOVE_MOCK]);
jest.mock('@repo/mock-json/pokemon/type/pokemon-types.json', () => [POKEMON_TYPE_MOCK]);

import { Test, type TestingModule } from '@nestjs/testing';
import { describe, expect, it, jest } from '@jest/globals';

import { AppService } from './app.service';


import { AuthService } from './auth/auth.service';
import { FinanceService } from './finance/finance.service';
import { PokemonService } from './pokemon/pokemon.service';

import { type CreateFinanceSeedsDto } from './finance/dto/create-finance-seeds.dto';
import { type CreatePokemonSeedsDto } from './pokemon/dto/create-pokemon-seeds.dto';
import { type CreateSeedDto } from './dto/create-seed.dto';
import { type FinanceSeederParams } from './finance/types';
import { type Income } from './finance/entities/incomes.entity';

describe('AppService', () => {
    let service: AppService;
    let authService: AuthService;
    let financeService: FinanceService;
    let pokemonService: PokemonService;

    const financeSeederParams: FinanceSeederParams = {
        billListJson: [BILL_MOCK],
        bankListJson: [BANK_MOCK],
        groupListJson: [GROUP_MOCK],
        financeListJson: [FINANCE_MOCK],
        expenseListJson: [EXPENSE_MOCK],
        supplierListJson: [SUPPLIER_MOCK],
        incomeListJson: [INCOME_MOCK],
        incomeSourceListJson: [INCOME_SOURCE_MOCK],
        supplierTypeListJson: [SUPPLIER_TYPE_MOCK],
    };

    const createFinanceSeedsDto: CreateFinanceSeedsDto = {
        bank: true,
        bill: true,
        group: true,
        expense: true,
        supplier: true,
        finance: true,
        income: true,
        incomeSource: true,
        supplierType: true,
    };

    const pokemonSeederParams: PokemonSeederParams = {
        listJson: [POKEMON_MOCK],
        moveListJson: [POKEMON_MOVE_MOCK],
        typeListJson: [POKEMON_TYPE_MOCK],
        abilityListJson: [POKEMON_ABILITY_MOCK],
    };

    const createPokemonSeedsDto:CreatePokemonSeedsDto = {
        move: true,
        type: true,
        ability: true,
        pokemon: true,
    };

    const createSeedDto:CreateSeedDto = {
         auth: true,
         finance: createFinanceSeedsDto,
         pokemon: createPokemonSeedsDto,
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppService,
                {
                    provide: AuthService,
                    useValue: {
                        seed: jest.fn(),
                        seeds: jest.fn(),
                    }
                },
                {
                    provide: FinanceService,
                    useValue: {
                        seeds: jest.fn(),
                    }
                },
                {
                    provide: PokemonService,
                    useValue: {
                        seeds: jest.fn(),
                    }
                },
            ]
        }).compile();

        service = module.get<AppService>(AppService);
        authService = module.get<AuthService>(AuthService);
        financeService = module.get<FinanceService>(FinanceService);
        pokemonService = module.get<PokemonService>(PokemonService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
        expect(financeService).toBeDefined();
        expect(pokemonService).toBeDefined();
    });

    describe('privates', () => {});
});