import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { type PokeApi } from '../../../../api';

import type { MoveResponse } from '../types';

import type { PokemonMove } from '../../../move';

import { POKEMON_ENTITY_INITIAL_BY_NAME_MOCK } from '../../mock';

import { PokeApiMoveService } from './service';

jest.mock('../../../../api');

describe('Pokemon Move Service', () => {
    let service: PokeApiMoveService;
    let mockPokeApi: jest.Mocked<PokeApi>;
    const moveInitialMock: PokemonMove = POKEMON_ENTITY_INITIAL_BY_NAME_MOCK.moves[0];
    const effectEntryMock: MoveResponse['effect_entries'][number] = {
        effect: 'effect',
        short_effect: 'short-effect',
    };
    const moveResponseMock: MoveResponse = {
        pp: 1,
        type: {
            url: 'https://pokemon-mock/type/1/',
            name: 'move-type',
        },
        name: 'move',
        power: 2,
        target: {
            url: 'https://pokemon-mock/move-target/11/',
            name: 'move-target',
        },
        priority: 3,
        accuracy: 4,
        damage_class: {
            url: 'https://pokemon-mock/move-damage-class/3/',
            name: 'damage-class-name',
        },
        effect_chance: 5,
        effect_entries: [effectEntryMock],
        learned_by_pokemon: [{
            url: 'https://pokemon-mock/pokemon/1/',
            name: 'pokemon',
        }]
    };

    const moveEntityMock: PokemonMove = {
        ...moveInitialMock,
        pp: moveResponseMock.pp,
        type: moveResponseMock.type.name,
        power: moveResponseMock.power,
        target: moveResponseMock.target.name,
        effect: effectEntryMock.effect,
        priority: moveResponseMock.priority,
        accuracy: moveResponseMock.accuracy,
        short_effect: effectEntryMock.short_effect,
        damage_class: moveResponseMock.damage_class.name,
        effect_chance: moveResponseMock.effect_chance,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockPokeApi = {
            move: {
                getByOrder: jest.fn(),
            }
        } as unknown as jest.Mocked<PokeApi>;

        service = new PokeApiMoveService(mockPokeApi);

    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('getOne', () => {
       xit('Should return a move of Pokemon', async () => {

            mockPokeApi.move.getByOrder.mockResolvedValue(moveResponseMock);

            const result = await service.getOne(moveInitialMock);
            expect(result.id).toEqual(moveEntityMock.id);
            expect(result.pp).toEqual(moveEntityMock.pp);
            expect(result.url).toEqual(moveEntityMock.url);
            expect(result.type).toEqual(moveEntityMock.type);
            expect(result.name).toEqual(moveEntityMock.name);
            expect(result.order).toEqual(moveEntityMock.order);
            expect(result.power).toEqual(moveEntityMock.power);
            expect(result.target).toEqual(moveEntityMock.target);
            expect(result.effect).toEqual(moveEntityMock.effect);
            expect(result.priority).toEqual(moveEntityMock.priority);
            expect(result.accuracy).toEqual(moveEntityMock.accuracy);
            expect(result.short_effect).toEqual(moveEntityMock.short_effect);
            expect(result.damage_class).toEqual(moveEntityMock.damage_class);
            expect(result.effect_chance).toEqual(moveEntityMock.effect_chance);
            expect(result.created_at).toEqual(moveEntityMock.created_at);
            expect(result.updated_at).toEqual(moveEntityMock.updated_at);
            expect(result.deleted_at).toEqual(moveEntityMock.deleted_at);
        });
    });
});