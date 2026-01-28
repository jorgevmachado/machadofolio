import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { POKEMON_GROWTH_RATE_MOCK } from './mock';
import type { PokemonGrowthRateEntity } from './types';
import PokemonGrowth from './growthRate';

describe('Pokemon Growth', () => {
    const entityMock: PokemonGrowthRateEntity = POKEMON_GROWTH_RATE_MOCK;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should create an instance pokemon Growth with all provided parameters', () => {
            const entity = new PokemonGrowth(entityMock);
            expect(entity).toBeInstanceOf(PokemonGrowth);
            expect(entity.id).toEqual(entityMock.id);
            expect(entity.url).toEqual(entityMock.url);
            expect(entity.name).toEqual(entityMock.name);
            expect(entity.order).toEqual(entityMock.order);
            expect(entity.formula).toEqual(entityMock.formula);
            expect(entity.created_at).toEqual(entityMock.created_at);
            expect(entity.updated_at).toEqual(entityMock.updated_at);
            expect(entity.deleted_at).toEqual(entityMock.deleted_at);
        });

        it('should create an instance with some provided parameters', () => {
            const entity = new PokemonGrowth();
            expect(entity.id).toBeUndefined();
            expect(entity.url).toBeUndefined();
            expect(entity.name).toBeUndefined();
            expect(entity.order).toEqual(0);
            expect(entity.formula).toBeUndefined();
            expect(entity.created_at).toBeUndefined();
            expect(entity.updated_at).toBeUndefined();
            expect(entity.deleted_at).toBeUndefined();
        });
    });

});