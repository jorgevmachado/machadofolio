import { type PokemonSeedsResult } from './pokemon/types';


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
import { type FinanceSeedsResult } from './finance/types';

describe('AppService', () => {
    let service: AppService;
    let authService: AuthService;
    let financeService: FinanceService;
    let pokemonService: PokemonService;

    const financeSeedsResult: FinanceSeedsResult = {
        bank: { list: 1, added: 1 },
        bill: { list: 1, added: 1 },
        group: { list: 1, added: 1 },
        months: { list: 1, added: 1 },
        income: { list: 1, added: 1 },
        expense: { list: 1, added: 1 },
        finance: { list: 1, added: 1 },
        supplier: { list: 1, added: 1 },
        incomeSource: { list: 1, added: 1 },
        supplierType: { list: 1, added: 1 },
    }

    const pokemonSeedsResult: PokemonSeedsResult = {
        move: { list: 1, added: 1 },
        type: { list: 1, added: 1 },
        ability: { list: 1, added: 1 },
        pokemon: { list: 1, added: 1 },
    }

    const mockSeedsResult = {
        auth: { list: 1, added: 1 },
        finance: financeSeedsResult,
        pokemon: pokemonSeedsResult,
    }

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
                        persistSeed: jest.fn(),
                        generateSeed: jest.fn(),
                    }
                },
                {
                    provide: FinanceService,
                    useValue: {
                        persistSeeds: jest.fn(),
                        generateSeeds: jest.fn(),
                    }
                },
                {
                    provide: PokemonService,
                    useValue: {
                        persistSeeds: jest.fn(),
                        generateSeeds: jest.fn(),
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

    describe('generateSeeds', () => {
        it('should return message when dont has any param to generate seed', async () => {
            jest.spyOn(service, 'hasAnyParamToGenerateSeed' as any).mockReturnValue(false);
            expect(await service.generateSeeds(createSeedDto)).toEqual({ message: 'No data was selected to generate the Seed.' });
        });

        it('should generate seeds', async () => {
            jest.spyOn(service, 'hasAnyParamToGenerateSeed' as any).mockReturnValue(true);
            jest.spyOn(authService, 'generateSeed').mockResolvedValueOnce({
                list: [USER_MOCK],
                added: [USER_MOCK],
            });
            jest.spyOn(financeService, 'generateSeeds').mockResolvedValueOnce(financeSeedsResult);
            jest.spyOn(pokemonService, 'generateSeeds').mockResolvedValueOnce(pokemonSeedsResult);
            expect(await service.generateSeeds(createSeedDto)).toEqual({
                ...mockSeedsResult,
                message: 'Seed Generate Successfully'
            });
        });
    });

    describe('persistSeeds', () => {
        it('should return message when dont has any param to persist seed', async () => {
            jest.spyOn(service, 'hasAnyParamToGenerateSeed' as any).mockReturnValue(false);
            expect(await service.persistSeeds(createSeedDto)).toEqual({ message: 'No data was selected to persist the Seed.' });
        });

        it('should persist seeds', async () => {
            jest.spyOn(service, 'hasAnyParamToGenerateSeed' as any).mockReturnValue(true);
            jest.spyOn(authService, 'persistSeed').mockResolvedValueOnce({
                list: [USER_MOCK],
                added: [USER_MOCK],
            });
            jest.spyOn(financeService, 'persistSeeds').mockResolvedValueOnce(financeSeedsResult);
            jest.spyOn(pokemonService, 'persistSeeds').mockResolvedValueOnce(pokemonSeedsResult);
            expect(await service.persistSeeds(createSeedDto)).toEqual({
                ...mockSeedsResult,
                message: 'Seed Persist Successfully'
            });
        });
    });

    describe('privates', () => {
        describe('DEFAULT_SEEDS', () => {
            const mockSeedsResultDefault = {
                auth: { list: 0, added: 0 },
                finance: {
                    bank: { list: 0, added: 0 },
                    bill: { list: 0, added: 0 },
                    group: { list: 0, added: 0 },
                    months: { list: 0, added: 0 },
                    income: { list: 0, added: 0 },
                    expense: { list: 0, added: 0 },
                    finance: { list: 0, added: 0 },
                    supplier: { list: 0, added: 0 },
                    incomeSource: { list: 0, added: 0 },
                    supplierType: { list: 0, added: 0 },
                },
                pokemon: {
                    move: { list: 0, added: 0 },
                    type: { list: 0, added: 0 },
                    ability: { list: 0, added: 0 },
                    pokemon: { list: 0, added: 0 },
                },
            }
            it('should return the default seeds', () => {
                expect(service['DEFAULT_SEEDS']).toEqual(mockSeedsResultDefault);
            });
        });

        describe('hasAnyParamToGenerateSeed', () => {
            it('should return true if any param is true', () => {
                expect(service['hasAnyParamToGenerateSeed']({...createSeedDto, auth: false })).toEqual(true);
            });
            it('should return false if all params are false', () => {
                expect(service['hasAnyParamToGenerateSeed']({ auth: false })).toEqual(false);
            });
        });
    });
});