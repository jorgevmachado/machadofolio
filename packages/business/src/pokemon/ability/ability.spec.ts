import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { POKEMON_ABILITY_MOCK } from './mock';
import PokemonAbility from './ability';
import type { PokemonAbilityEntity } from './types';

describe('Pokemon Ability', () => {
    const entityMock: PokemonAbilityEntity = POKEMON_ABILITY_MOCK;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        xit('should create an instance pokemon ability with all provided parameters', () => {
            const entity = new PokemonAbility(entityMock);
            expect(entity).toBeInstanceOf(PokemonAbility);
            expect(entity.id).toEqual(entityMock.id);
            expect(entity.name).toEqual(entityMock.name);
            expect(entity.slot).toEqual(entityMock.slot);
            expect(entity.order).toEqual(entityMock.order);
            expect(entity.is_hidden).toEqual(entityMock.is_hidden);
            expect(entity.created_at).toEqual(entityMock.created_at);
            expect(entity.updated_at).toEqual(entityMock.updated_at);
            expect(entity.deleted_at).toEqual(entityMock.deleted_at);
        });
        xit('should create an instance with some provided parameters', () => {
            const entity = new PokemonAbility();
            expect(entity).toBeInstanceOf(PokemonAbility);
            expect(entity.id).toBeUndefined();
            expect(entity.name).toBeUndefined();
            expect(entity.slot).toBeUndefined();
            expect(entity.order).toEqual(0);
            expect(entity.is_hidden).toBeUndefined();
            expect(entity.created_at).toBeUndefined();
            expect(entity.updated_at).toBeUndefined();
            expect(entity.deleted_at).toBeUndefined();
        });
    });
});