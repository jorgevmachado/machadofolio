import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import {
    chunk
} from './array';

describe('Array function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('chunk', () => {
        const mockList = [
            'ITEM 1',
            'ITEM 2',
            'ITEM 3',
            'ITEM 4',
            'ITEM 5',
            'ITEM 6',
            'ITEM 7',
            'ITEM 8',
            'ITEM 9',
            'ITEM 10',
            'ITEM 11',
            'ITEM 12',
            'ITEM 13',
            'ITEM 14',
            'ITEM 15',
            'ITEM 16',
            'ITEM 17',
            'ITEM 18',
            'ITEM 19',
            'ITEM 20',
        ];

        it('should return empty array when input is empty\n', () => {
            expect(chunk([], 3)).toEqual([]);
        });

        it('should return a copy of the array if the size is 1\n', () => {
            expect(chunk([1,2,3], 1)).toEqual([[1], [2], [3]]);
        });

        it('should return an array with the original array if size is greater than the array\n', () => {
            expect(chunk(mockList, 100)).toEqual([mockList]);
        });

        it('should distribute correctly when array is not an exact multiple of size\n', () => {
            const arr = [1,2,3,4,5];
            expect(chunk(arr, 2)).toEqual([[1,2],[3,4],[5]]);
        });


        it('must split the array into groups of specified size\n', () => {
            const chunked = chunk(mockList, 3);
            expect(chunked.length).toBe(7);

            for(let i = 0; i < 6; i++) {
                expect(chunked[i].length).toBe(3);
            }

            expect(chunked[6].length).toBe(2);
            expect(chunked).toEqual([
                ['ITEM 1', 'ITEM 2', 'ITEM 3'],
                ['ITEM 4', 'ITEM 5', 'ITEM 6'],
                ['ITEM 7', 'ITEM 8', 'ITEM 9'],
                ['ITEM 10', 'ITEM 11', 'ITEM 12'],
                ['ITEM 13', 'ITEM 14', 'ITEM 15'],
                ['ITEM 16', 'ITEM 17', 'ITEM 18'],
                ['ITEM 19', 'ITEM 20']
            ]);
        });
    });
});