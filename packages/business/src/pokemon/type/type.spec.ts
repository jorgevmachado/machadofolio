import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { POKEMON_TYPE } from './mock';
import Type from './type';
import type { TypeEntity } from './types';

describe('Pokemon Type', () => {
    const entityMock: TypeEntity = POKEMON_TYPE;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should create an instance pokemon type with all provided parameters', () => {
            const entity = new Type(entityMock);
            expect(entity).toBeInstanceOf(Type);
            expect(entity.id).toEqual(entityMock.id);
            expect(entity.url).toEqual(entityMock.url);
            expect(entity.name).toEqual(entityMock.name);
            expect(entity.order).toEqual(entityMock.order);
            expect(entity.text_color).toEqual(entityMock.text_color);
            expect(entity.created_at).toEqual(entityMock.created_at);
            expect(entity.updated_at).toEqual(entityMock.updated_at);
            expect(entity.deleted_at).toEqual(entityMock.deleted_at);
            expect(entity.background_color).toEqual(entityMock.background_color);
        });

        it('should create an instance with some provided parameters', () => {
            const entity = new Type();
            expect(entity.id).toBeUndefined();
            expect(entity.url).toBeUndefined();
            expect(entity.name).toBeUndefined();
            expect(entity.order).toBeUndefined();
            expect(entity.text_color).toBeUndefined();
            expect(entity.created_at).toBeUndefined();
            expect(entity.updated_at).toBeUndefined();
            expect(entity.deleted_at).toBeUndefined();
            expect(entity.background_color).toBeUndefined();
        });
    });

});