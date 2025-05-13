import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import Ability from './ability';
import type { AbilityEntity } from './types';
import { POKEMON_ABILITY_MOCK } from './mock';


describe('Pokemon Ability', () => {
    const entityMock: AbilityEntity = POKEMON_ABILITY_MOCK;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should create an instance pokemon ability with all provided parameters', () => {
            const entity = new Ability(entityMock);
            expect(entity).toBeInstanceOf(Ability);
            expect(entity.id).toEqual(entityMock.id);
            expect(entity.name).toEqual(entityMock.name);
            expect(entity.slot).toEqual(entityMock.slot);
            expect(entity.order).toEqual(entityMock.order);
            expect(entity.is_hidden).toEqual(entityMock.is_hidden);
            expect(entity.created_at).toEqual(entityMock.created_at);
            expect(entity.updated_at).toEqual(entityMock.updated_at);
            expect(entity.deleted_at).toEqual(entityMock.deleted_at);
        });
        it('should create an instance with some provided parameters', () => {
            const entity = new Ability();
            expect(entity).toBeInstanceOf(Ability);
            expect(entity.id).toBeUndefined();
            expect(entity.name).toBeUndefined();
            expect(entity.slot).toBeUndefined();
            expect(entity.order).toBeUndefined();
            expect(entity.is_hidden).toBeUndefined();
            expect(entity.created_at).toBeUndefined();
            expect(entity.updated_at).toBeUndefined();
            expect(entity.deleted_at).toBeUndefined();
        });
    });
});