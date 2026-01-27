jest.mock('../../abstract', () => {
    class NestModuleAbstract {
        public pathUrl: string;
        public subPathUrl: string;
        public get = jest.fn<(...args: any[]) => Promise<any>>();
        public post = jest.fn<(...args: any[]) => Promise<any>>();
        public path = jest.fn<(...args: any[]) => Promise<any>>();
        public getAll = jest.fn<(...args: any[]) => Promise<any>>();
        constructor(config: any) {
            this.pathUrl = config?.pathUrl;
            this.subPathUrl = config?.subPathUrl;
        }
    }

    return { NestModuleAbstract };
});

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import type { QueryParameters } from '../../../../types';

import { Trainer } from './trainer';

describe('Pokemon Trainer', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };
    const mockEntity = {
      id: '01ade48b-573f-41fe-9d33-34a3cb4c0b9c',
      user: {
        id: 'eaca4c08-e62d-495a-ae1c-918199da8d52',
        cpf: '49892120450',
        name: 'John Doe',
        email: 'john.doe@mail.com',
        gender: 'MALE',
        whatsapp: '11998765432',
        created_at: new Date('2024-09-09T00:00:00.000Z'),
        updated_at: new Date('2024-09-09T00:00:00.000Z'),
        date_of_birth: new Date('1990-01-01T00:00:00.000Z'),
      },
      created_at: new Date('2025-02-06T18:26:04.618Z'),
      updated_at: new Date('2025-02-06T18:26:04.618Z'),
      deleted_at: undefined,
      capture_rate: 45,
      captured_pokemons: [{
        id: 'ac0138cd-4910-4000-8000-000000000000',
        hp: 0,
        url: 'http://pokemon-mock/1/',
        name: 'pokemon',
        image: 'https://pokemon-mock/pokemon/1.png',
        speed: 0,
        moves: [],
        types: [],
        order: 1,
        status: 'COMPLETE',
        attack: 49,
        defense: 49,
        habitat: 'habitat',
        is_baby: false,
        shape_url: 'http://pokemon-mock/pokemon-shape/8/',
        abilities: [],
        evolutions: [],
        created_at: new Date('2025-02-06T18:26:04.618Z'),
        updated_at: new Date('2025-02-06T18:26:04.618Z'),
        deleted_at: undefined,
        shape_name: 'shape_name',
        is_mythical: false,
        gender_rate: 1,
        is_legendary: false,
        capture_rate: 45,
        hatch_counter: 20,
        base_happiness: 50,
        special_attack: 65,
        special_defense: 65,
        evolution_chain_url: 'http://pokemon-mock/evolution-chain/1/',
        evolves_from_species: undefined,
        has_gender_differences: false
      }],
    }

    let trainer: Trainer;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        trainer = new Trainer(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should call inherited methods from NestModuleAbstract about pokemon move', async () => {
            (trainer.getAll as any).mockResolvedValue([]);

            const queryParams: QueryParameters = { name: 'test' };
            const result = await trainer.getAll(queryParams);

            expect(trainer.getAll).toHaveBeenCalledTimes(1);
            expect(trainer.getAll).toHaveBeenCalledWith(queryParams);
            expect(result).toEqual([]);
        });
    });

    describe('initialize', () => {
      it('should request service initialize', async () => {
        (trainer.post as any).mockResolvedValue(mockEntity);
        const result = await trainer.initialize('bulbasaur');
        expect(trainer.post).toHaveBeenCalledTimes(1);
        expect(trainer.post).toHaveBeenCalledWith('pokemon/trainer', { body: { pokemonName: 'bulbasaur'}});
        expect(result).toEqual(mockEntity);
      });
    });
});
