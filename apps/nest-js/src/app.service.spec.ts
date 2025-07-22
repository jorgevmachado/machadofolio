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
import { type FinanceSeederParams } from './finance/types';
import { type CreatePokemonSeedsDto } from './pokemon/dto/create-pokemon-seeds.dto';
import { type CreateSeedDto } from './dto/create-seed.dto';



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
        supplierTypeListJson: [SUPPLIER_TYPE_MOCK],
    };

    const createFinanceSeedsDto: CreateFinanceSeedsDto = {
        bank: true,
        bill: true,
        group: true,
        expense: true,
        supplier: true,
        finance: true,
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

    describe('seeds', () => {
        it('Should seed the database', async () => {
            const financeSeedsMock = {
                    bills: 1,
                    groups: 1,
                    banks: 1,
                    expenses: 1,
                    finances: 1,
                    suppliers: 1,
                    supplierTypes: 1,
                };
            const pokemonSeedsMock = {
                moves: 1,
                types: 1,
                pokemons: 1,
                abilities: 1,
            };
            jest.spyOn(service, 'userSeeds' as any).mockResolvedValueOnce([USER_MOCK]);
            jest.spyOn(service, 'financeSeeds' as any).mockResolvedValueOnce(financeSeedsMock);
            jest.spyOn(service, 'pokemonSeeds' as any).mockResolvedValueOnce(pokemonSeedsMock);
            const result = await service.seeds(createSeedDto);
            expect(result).toEqual({
                users: 1,
                finances: financeSeedsMock,
                pokemons: pokemonSeedsMock,
                message: 'Seeds successfully',
            });
        });
    });

    describe('privates', () => {
        describe('userSeeds', () => {
            it('Should seed the database with users', async () => {
                jest.spyOn(authService, 'seeds').mockResolvedValueOnce([]);
                jest.spyOn(authService, 'seed').mockResolvedValueOnce(USER_MOCK);
                const result = await service['userSeeds']({ auth: true, finance: { finance: true } });
                expect(result).toEqual([USER_MOCK]);
            });
        });

        describe('financeSeeds', () => {

            it('Should return undefine when createFinanceSeedsDto is empty.', async () => {
                const result = await service['financeSeeds']([USER_MOCK]);
                expect(result).toBeUndefined();
            });

            it('Should finance seeds successfully.', async () => {
                jest.spyOn(service, 'createFinanceSeederParams' as any).mockReturnValue(financeSeederParams);
                jest.spyOn(financeService, 'seeds').mockResolvedValueOnce({
                    bills: [BILL_MOCK],
                    banks: [BANK_MOCK],
                    groups: [GROUP_MOCK],
                    finances: [FINANCE_MOCK],
                    expenses: [EXPENSE_MOCK],
                    suppliers: [SUPPLIER_MOCK],
                    supplierTypes: [SUPPLIER_TYPE_MOCK],
                })
                const result = await service['financeSeeds']([USER_MOCK], createFinanceSeedsDto);
                expect(result).toEqual({
                    bills: 1,
                    groups: 1,
                    banks: 1,
                    expenses: 1,
                    finances: 1,
                    suppliers: 1,
                    supplierTypes: 1,
                });
            });
        });

        describe('pokemonSeeds', () => {
            it('Should return undefine when createPokemonSeedsDto is empty.', async () => {
                const result = await service['pokemonSeeds']([USER_MOCK]);
                expect(result).toBeUndefined();
            });

            it('Should pokemon seeds successfully.', async () => {
                jest.spyOn(service, 'createPokemonSeederParams' as any).mockReturnValue(pokemonSeederParams);
                jest.spyOn(pokemonService, 'seeds').mockResolvedValueOnce({
                    moves: [POKEMON_MOVE_MOCK],
                    types: [POKEMON_TYPE_MOCK],
                    pokemons: [POKEMON_MOCK],
                    abilities: [POKEMON_ABILITY_MOCK],
                })
                const result = await service['pokemonSeeds']([USER_MOCK], createPokemonSeedsDto);
                expect(result).toEqual({
                    moves: 1,
                    types: 1,
                    pokemons: 1,
                    abilities: 1,
                });
            });
        });

        describe('createFinanceSeederParams', () => {
            it('Should return params to create finance.', () => {
                const result = service['createFinanceSeederParams'](createFinanceSeedsDto);
                expect(result).toEqual(financeSeederParams);
            });
        });

        describe('createPokemonSeederParams', () => {
            it('Should return params to create pokemon.', () => {
                const result = service['createPokemonSeederParams'](createPokemonSeedsDto);
                expect(result).toEqual(pokemonSeederParams);
            });
        });
    });
});