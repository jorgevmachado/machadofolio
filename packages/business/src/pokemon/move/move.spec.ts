import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { POKEMON_MOVE_MOCK } from './mock';
import PokemonMove from './move';
import type { PokemonMoveEntity } from './types';

describe('Pokemon Move', () => {
    const entityMock: PokemonMoveEntity = POKEMON_MOVE_MOCK;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should create an instance pokemon move with all provided parameters', () => {
            const entity = new PokemonMove(entityMock);
            expect(entity.id).toEqual(entityMock.id);
            expect(entity.pp).toEqual(entityMock.pp);
            expect(entity.url).toEqual(entityMock.url);
            expect(entity.type).toEqual(entityMock.type);
            expect(entity.name).toEqual(entityMock.name);
            expect(entity.order).toEqual(entityMock.order);
            expect(entity.power).toEqual(entityMock.power);
            expect(entity.target).toEqual(entityMock.target);
            expect(entity.effect).toEqual(entityMock.effect);
            expect(entity.priority).toEqual(entityMock.priority);
            expect(entity.accuracy).toEqual(entityMock.accuracy);
            expect(entity.short_effect).toEqual(entityMock.short_effect);
            expect(entity.damage_class).toEqual(entityMock.damage_class);
            expect(entity.effect_chance).toEqual(entityMock.effect_chance);
            expect(entity.created_at).toEqual(entityMock.created_at);
            expect(entity.updated_at).toEqual(entityMock.updated_at);
            expect(entity.deleted_at).toEqual(entityMock.deleted_at);
        });

        it('should create an instance with some provided parameters', () => {
            const entity = new PokemonMove();
            expect(entity.id).toBeUndefined();
            expect(entity.pp).toEqual(0);
            expect(entity.url).toBeUndefined();
            expect(entity.type).toBeUndefined();
            expect(entity.name).toBeUndefined();
            expect(entity.order).toEqual(0);
            expect(entity.power).toEqual(0);
            expect(entity.target).toBeUndefined();
            expect(entity.effect).toBeUndefined();
            expect(entity.priority).toEqual(0);
            expect(entity.accuracy).toEqual(0);
            expect(entity.short_effect).toBeUndefined();
            expect(entity.damage_class).toBeUndefined();
            expect(entity.effect_chance).toEqual(0);
            expect(entity.created_at).toBeUndefined();
            expect(entity.updated_at).toBeUndefined();
            expect(entity.deleted_at).toBeUndefined();
        });
    });

});