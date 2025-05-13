import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { EStatus } from '../api';

import { POKEMON_MOCK } from './mock';
import Pokemon from './pokemon';
import type { PokemonEntity } from './types';

describe('Pokemon', () => {
    const entityMock: PokemonEntity = POKEMON_MOCK;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should create an instance Pokemon with all provided parameters', () => {
            const entity = new Pokemon(entityMock);
            expect(entity).toBeInstanceOf(Pokemon);
            expect(entity.id).toEqual(entityMock.id);
            expect(entity.hp).toEqual(entityMock.hp);
            expect(entity.url).toEqual(entityMock.url);
            expect(entity.name).toEqual(entityMock.name);
            expect(entity.order).toEqual(entityMock.order);
            expect(entity.image).toEqual(entityMock.image);
            expect(entity.speed).toEqual(entityMock.speed);
            expect(entity.moves).toEqual(entityMock.moves);
            expect(entity.types).toEqual(entityMock.types);
            expect(entity.status).toEqual(entityMock.status);
            expect(entity.attack).toEqual(entityMock.attack);
            expect(entity.defense).toEqual(entityMock.defense);
            expect(entity.habitat).toEqual(entityMock.habitat);
            expect(entity.is_baby).toEqual(entityMock.is_baby);
            expect(entity.shape_url).toEqual(entityMock.shape_url);
            expect(entity.abilities).toEqual(entityMock.abilities);
            expect(entity.created_at).toEqual(entityMock.created_at);
            expect(entity.updated_at).toEqual(entityMock.updated_at);
            expect(entity.deleted_at).toEqual(entityMock.deleted_at);
            expect(entity.evolutions).toEqual(entityMock.evolutions);
            expect(entity.shape_name).toEqual(entityMock.shape_name);
            expect(entity.is_mythical).toEqual(entityMock.is_mythical);
            expect(entity.gender_rate).toEqual(entityMock.gender_rate);
            expect(entity.is_legendary).toEqual(entityMock.is_legendary);
            expect(entity.capture_rate).toEqual(entityMock.capture_rate);
            expect(entity.hatch_counter).toEqual(entityMock.hatch_counter);
            expect(entity.base_happiness).toEqual(entityMock.base_happiness);
            expect(entity.special_attack).toEqual(entityMock.special_attack);
            expect(entity.special_defense).toEqual(entityMock.special_defense);
            expect(entity.evolution_chain_url).toEqual(entityMock.evolution_chain_url);
            expect(entity.evolves_from_species).toEqual(entityMock.evolves_from_species);
            expect(entity.has_gender_differences).toEqual(entityMock.has_gender_differences);
        });

        it('should create an instance with some provided parameters', () => {
            const entity = new Pokemon();
            expect(entity).toBeInstanceOf(Pokemon);
            expect(entity.id).toBeUndefined();
            expect(entity.hp).toBeUndefined();
            expect(entity.url).toBeUndefined();
            expect(entity.name).toBeUndefined();
            expect(entity.order).toBeUndefined();
            expect(entity.image).toBeUndefined();
            expect(entity.speed).toBeUndefined();
            expect(entity.moves).toBeUndefined();
            expect(entity.types).toBeUndefined();
            expect(entity.status).toEqual(EStatus.INCOMPLETE);
            expect(entity.attack).toBeUndefined();
            expect(entity.defense).toBeUndefined();
            expect(entity.habitat).toBeUndefined();
            expect(entity.is_baby).toBeUndefined();
            expect(entity.shape_url).toBeUndefined();
            expect(entity.abilities).toBeUndefined();
            expect(entity.created_at).toBeUndefined();
            expect(entity.updated_at).toBeUndefined();
            expect(entity.deleted_at).toBeUndefined();
            expect(entity.evolutions).toBeUndefined();
            expect(entity.shape_name).toBeUndefined();
            expect(entity.is_mythical).toBeUndefined();
            expect(entity.gender_rate).toBeUndefined();
            expect(entity.is_legendary).toBeUndefined();
            expect(entity.capture_rate).toBeUndefined();
            expect(entity.hatch_counter).toBeUndefined();
            expect(entity.base_happiness).toBeUndefined();
            expect(entity.special_attack).toBeUndefined();
            expect(entity.special_defense).toBeUndefined();
            expect(entity.evolution_chain_url).toBeUndefined();
            expect(entity.evolves_from_species).toBeUndefined();
            expect(entity.has_gender_differences).toBeUndefined();
        });
    });
});