import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { parseDateFromString } from '../date';

import { findEntityBy, isObject, isObjectEmpty, serialize, transformDateStringInDate, transformObjectDateAndNulls } from './object';


describe('Object function', () => {
    const mockList = [
        { id: '1', name: 'John Doe', name_code: 'john_doe' },
        { id: '2', name: 'Jane Smith', name_code: 'jane_smith' },
        { id: '3', name: 'Alice Johnson', name_code: 'alice_johnson' },
    ];
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('serialize', () => {
        it('should return serialized string when received only one value', () => {
            expect(serialize({ name: 'your_name' })).toEqual('name=your_name');
        });

        it('should return serialized string when received multiples values', () => {
            const data = { name: 'your_name', lastname: 'your_lastname' };
            expect(serialize(data)).toEqual('name=your_name&lastname=your_lastname');
        });

        it('should return undefined when received empty object', () => {
            expect(serialize({})).toEqual(undefined);
        });
    });

    describe('isObject', () => {
        it('should return true when param is a object', () => {
            expect(isObject(mockList[0])).toBeTruthy();
        });

        it('should return false when param is not a valid object', () => {
            expect(isObject('not-object')).toBeFalsy();
        });
    });
    
    describe('findEntityBy', () => {
        it('Should find an entity by ID.', () => {
            const result = findEntityBy({ key: 'id', value: '2', list: mockList });
            expect(result).toEqual(mockList[1]);
        });

        it('Should find an entity by name.', () => {
            const result = findEntityBy({
                key: 'name',
                value: 'Alice Johnson',
                list: mockList,
            });
            expect(result).toEqual(mockList[2]);
        });

        it('Should find an entity by name_code.', () => {
            const result = findEntityBy({
                key: 'name_code',
                value: 'alice_johnson',
                list: mockList,
            });
            expect(result).toEqual(mockList[2]);
        });

        it('Should return undefined if you cant find the ID', () => {
            const result = findEntityBy({ key: 'id', value: '99', list: mockList });
            expect(result).toBeUndefined();
        });

        it('Should return undefined if you cant find the name', () => {
            const result = findEntityBy({
                key: 'name',
                value: 'Unknown Name',
                list: mockList,
            });
            expect(result).toBeUndefined();
        });

        it('Should return undefined if you cant find the name_code', () => {
            const result = findEntityBy({
                key: 'name_code',
                value: 'Unknown Name',
                list: mockList,
            });
            expect(result).toBeUndefined();
        });

        it('Should return undefined for an empty list.', () => {
            const result = findEntityBy({ key: 'id', value: '1', list: [] });
            expect(result).toBeUndefined();
        });

        it('Should return undefined if the key does not exist in the object.', () => {
            const result = findEntityBy({
                key: 'unknownKey' as never,
                value: '1',
                list: mockList,
            });
            expect(result).toBeUndefined();
        });
    });

    describe('transformObjectDateAndNulls', () => {
        const receivedData = {
            id: 1,
            name: 'Example',
            created_at: '2023-10-21T12:34:56Z',
            updated_at: '2023-10-22T10:00:00Z',
            deleted_at: null,
            nested: {
                created_at: '2023-10-23T08:45:00Z',
                deleted_at: null,
                items: [
                    {
                        id: 1,
                        created_at: '2023-10-24T12:00:00Z',
                        deleted_at: null,
                    },
                ],
            },
        };
        const expectedData = {
            id: 1,
            name: 'Example',
            created_at: new Date('2023-10-21T12:34:56Z'),
            updated_at: new Date('2023-10-22T10:00:00Z'),
            deleted_at: undefined,
            nested: {
                created_at: new Date('2023-10-23T08:45:00Z'),
                deleted_at: undefined,
                items: [
                    {
                        id: 1,
                        created_at: new Date('2023-10-24T12:00:00Z'),
                        deleted_at: undefined,
                    },
                ],
            },
        };
        it('Should transform the object dates and nulls.', () => {
            expect(transformObjectDateAndNulls(receivedData)).toEqual(expectedData);
        });
    });

    describe('transformDateStringInDate', () => {
        const receivedData = {
            id: 1,
            name: 'Example',
            created_at: '2000-01-01T00:00:00.000Z',
            updated_at: '2000-01-01T00:00:00.000Z',
            deleted_at: undefined,
            date_of_birth: '2000-01-01T00:00:00.000Z',
            nested: {
                created_at: '2000-01-01T00:00:00.000Z',
                deleted_at: undefined,
                date_of_birth: '2000-01-01T00:00:00.000Z',
                items: [
                    {
                        id: 1,
                        created_at: '2023-10-24T12:00:00Z',
                        deleted_at: undefined,
                        date_of_birth: '2000-01-01T00:00:00.000Z',
                    },
                ],
            },
        };
        const expectedData = {
            id: 1,
            name: 'Example',
            created_at: parseDateFromString('2000-01-01T00:00:00.000Z'),
            updated_at: parseDateFromString('2000-01-01T00:00:00.000Z'),
            deleted_at: undefined,
            date_of_birth: parseDateFromString('2000-01-01T00:00:00.000Z'),
            nested: {
                created_at: parseDateFromString('2000-01-01T00:00:00.000Z'),
                deleted_at: undefined,
                date_of_birth: parseDateFromString('2000-01-01T00:00:00.000Z'),
                items: [
                    {
                        id: 1,
                        created_at: parseDateFromString('2023-10-24T12:00:00Z'),
                        deleted_at: undefined,
                        date_of_birth: parseDateFromString('2000-01-01T00:00:00.000Z'),
                    },
                ],
            },
        };
        it('Should transform the object dates and nulls.', () => {
            expect(transformDateStringInDate(receivedData)).toEqual(expectedData);
        });
    });

    describe('isObjectEmpty', () => {
        it('should return true when object is empty', () => {
            expect(isObjectEmpty({})).toBeTruthy();
        });

        it('should return false when object is not empty', () => {
            expect(isObjectEmpty(mockList[0])).toBeFalsy();
        });
    });
});