import { INITIAL_STATE, getAxisYDomain, updateDomainItem, buildDomain } from './domain';

import type { LineChartLabelsItem } from '../types';

jest.mock('@repo/services', () => ({
    convertToNumber: (str: string) => {
        const value = parseFloat(str);
        if(isNaN(value)) {
            return 0;
        }
        return value;
    },
}));

describe('functions domain', () => {
    describe('INITIAL_STATE', () => {
        it('should return initial state', () => {
            expect(INITIAL_STATE).toEqual({
                top: 'dataMax+1',
                top2: 'dataMax+20',
                left: 'dataMin',
                right: 'dataMax',
                bottom: 'dataMin-1',
                bottom2: 'dataMin-20',
                animation: true,
                refAreaLeft: undefined,
                refAreaRight: undefined,
            })
        })
    });

    describe('getAxisYDomain', () => {
        const mockData = [
            { name: 1, cost: 4.11, impression: 100 },
            { name: 2, cost: 2.39, impression: 120 },
            { name: 3, cost: 1.37, impression: 150 },
            { name: 4, cost: 1.16, impression: 180 },
            { name: 5, cost: 2.29, impression: 200 },
            { name: 6, cost: 3, impression: 499 },
            { name: 7, cost: 0.53, impression: 50 },
            { name: 8, cost: 2.52, impression: 100 },
            { name: 9, cost: 1.79, impression: 200 },
            { name: 10, cost: 2.94, impression: 222 },
            { name: 11, cost: 4.3, impression: 210 },
            { name: 12, cost: 4.41, impression: 300 },
            { name: 13, cost: 2.1, impression: 50 },
            { name: 14, cost: 8, impression: 190 },
            { name: 15, cost: 0, impression: 300 },
            { name: 16, cost: 9, impression: 400 },
            { name: 17, cost: 3, impression: 200 },
            { name: 18, cost: 2, impression: 50 },
            { name: 19, cost: 3, impression: 100 },
            { name: 20, cost: 7, impression: 100 },
        ];

        it('should return initial state when from/to are undefined', () => {
            const result = getAxisYDomain({
                ref: 'cost',
                data: mockData,
                offset: 1,
            });
            expect(result).toEqual([INITIAL_STATE.bottom, INITIAL_STATE.top]);
        });

        it('should return initial state when from is undefined', () => {
            const result = getAxisYDomain({
                data: mockData,
                from: undefined,
                to: 2,
                ref: 'cost',
                offset: 1,
            });
            expect(result).toEqual([INITIAL_STATE.bottom, INITIAL_STATE.top]);
        });

        it('should return initial state when to is undefined', () => {
            const result = getAxisYDomain({
                data: mockData,
                from: 1,
                to: undefined,
                ref: 'cost',
                offset: 1,
            });
            expect(result).toEqual([INITIAL_STATE.bottom, INITIAL_STATE.top]);
        });

        it('should return correct domain for valid from/to and numeric values', () => {
            const result = getAxisYDomain({
                to: 4,
                ref: 'cost',
                from: 1,
                data: mockData,
                offset: 2,
            });
            expect(result).toEqual([-2, 6.11]);
        });

        it('should return correct domain for a single element slice', () => {
            const result = getAxisYDomain({
                to: 2,
                ref: 'impression',
                from: 2,
                data: mockData,
                offset: 10,
            });
            expect(result).toEqual([-10, 130]);
        });

        it('should handle empty data array', () => {
            const result = getAxisYDomain({
                to: 2,
                ref: 'cost',
                from: 1,
                data: [],
                offset: 1,
            });
            expect(result).toEqual([INITIAL_STATE.bottom, INITIAL_STATE.top]);
        });

        it('should handle non-numeric values gracefully', () => {
            const data = [
                { name: 'abc', cost: 'abc', impression: 'def' },
                { name: 'impression', cost: '', impression: '' },
            ];
            const result = getAxisYDomain({
                to: 2,
                ref: 'cost',
                data,
                from: 1,
                offset: 1,
            });
            expect(result).toEqual(['dataMin-1', 'dataMax+1']);
        });

        it('should handle offset zero', () => {
            const result = getAxisYDomain({
                to: 4,
                ref: 'cost',
                data: mockData,
                from: 1,
                offset: 0,
            });
            expect(result).toEqual([0, 4.11]);
        });

        it('should handle negative offset', () => {
            const result = getAxisYDomain({
                to: 4,
                ref: 'cost',
                data: mockData,
                from: 1,
                offset: -2,
            });
            expect(result).toEqual([2,  2.1100000000000003]);
        });
    });

    describe('updateDomainItem', () => {
        const basePrev = {
            top: 'dataMax+1',
            top2: 'dataMax+20',
            left: 'dataMin',
            right: 'dataMax',
            bottom: 'dataMin-1',
            bottom2: 'dataMin-20',
            animation: true,
            refAreaLeft: 1,
            refAreaRight: 4,
        };
        const labels: Array<LineChartLabelsItem> = [
            {
                key: 'cost',
                type: 'natural',
                offset: 1,
                stroke: '#8884d8',
                dataKey: 'cost',
                yAxisId: '1',
                animationDuration: 300
            },
            {
                key: 'impression',
                type: 'natural',
                offset: 50,
                stroke: '#82ca9d',
                yAxisId: '2',
                dataKey: 'impression',
                animationDuration: 300
            }
        ];
        const mockData = [
            { name: 1, cost: 4.11, impression: 100 },
            { name: 2, cost: 2.39, impression: 120 },
            { name: 3, cost: 1.37, impression: 150 },
            { name: 4, cost: 1.16, impression: 180 },
        ];

        it('should return defaultResult if labels are missing', () => {
            const result = updateDomainItem({ prev: basePrev, data: mockData, labels: [] });
            expect(result).toEqual({ ...basePrev, refAreaLeft: undefined, refAreaRight: undefined });
        });

        it('should return defaultResult if only one label is present', () => {
            const result = updateDomainItem({
                prev: basePrev,
                data: mockData,
                labels: [{
                    key: 'cost',
                    type: 'natural',
                    offset: 1,
                    stroke: '#8884d8',
                    dataKey: 'cost',
                    yAxisId: '1',
                    animationDuration: 300
                }]
            });
            expect(result).toEqual({ ...basePrev, refAreaLeft: undefined, refAreaRight: undefined });
        });

        it('should return defaultResult if leftInit === rightInit', () => {
            const prev = { ...basePrev, refAreaLeft: 2, refAreaRight: 2 };
            const result = updateDomainItem({ prev, data: mockData, labels });
            expect(result).toEqual({ ...prev, refAreaLeft: undefined, refAreaRight: undefined });
        });

        it('should return defaultResult if rightInit is empty string', () => {
            const prev = { ...basePrev, refAreaRight: '' };
            const result = updateDomainItem({ prev, data: mockData, labels });
            expect(result).toEqual({ ...prev, refAreaLeft: undefined, refAreaRight: undefined });
        });

        it('should invert refAreaLeft/refAreaRight if leftInit > rightInit', () => {
            const prev = { ...basePrev, refAreaLeft: 4, refAreaRight: 1 };
            const result = updateDomainItem({ prev, data: mockData, labels });
            expect(result).toMatchObject({
                left: 1,
                right: 4,
                bottom: -1,
                top: 5.11,
                bottom2: -50,
                top2: 230,
                refAreaLeft: undefined,
                refAreaRight: undefined,
            });
        });

        it('should calculate correct domain when all is valid', () => {
            const result = updateDomainItem({ prev: basePrev, data: mockData, labels });
            expect(result).toMatchObject({
                left: 1,
                right: 4,
                bottom: -1,
                top: 5.11,
                bottom2: -50,
                top2: 230,
                refAreaLeft: undefined,
                refAreaRight: undefined,
            });
        });

        it('should return defaultResult if getAxisYDomain returns invalid values', () => {
            const prev = { ...basePrev, refAreaLeft: 1, refAreaRight: 4 };
            const labelsInvalid: Array<LineChartLabelsItem> = [
                {
                    key: 'cost',
                    type: 'natural',
                    offset: 1,
                    stroke: '#8884d8',
                    dataKey: 'invalidKey',
                    yAxisId: '1',
                    animationDuration: 300
                },
                {
                    key: 'impression',
                    type: 'natural',
                    offset: 50,
                    stroke: '#82ca9d',
                    yAxisId: '2',
                    dataKey: 'impression',
                    animationDuration: 300
                }
            ];

            const result = updateDomainItem({ prev, data: mockData, labels: labelsInvalid });
            expect(result).toEqual({
                ...prev,
                top2: 230,
                left: 1,
                right: 4,
                bottom2: -50,
                refAreaLeft: undefined,
                refAreaRight: undefined
            });
        });

        it('should use INITIAL_STATE.left/right if refAreaLeft/refAreaRight are undefined', () => {
            const prev = { ...basePrev, refAreaLeft: undefined, refAreaRight: undefined };
            const result = updateDomainItem({ prev, data: mockData, labels });
            expect(result.left).toBe(INITIAL_STATE.left);
            expect(result.right).toBe(INITIAL_STATE.right);
        });
    });

    describe('buildDomain', () => {
        const customerDomain = {
            top: 100,
            top2: 200,
            left: 1,
            right: 10,
            bottom: 0,
            bottom2: 50,
            animation: true,
            refAreaLeft: undefined,
            refAreaRight: undefined,
            custom: 'customValue',
            nullValue: null,
        };

        it('should return empty array if customDomain is empty', () => {
            expect(buildDomain([], customerDomain)).toEqual([]);
        });

        it('should return all values for existing keys', () => {
            expect(buildDomain(['top', 'bottom', 'left'], customerDomain)).toEqual([100, 0, 1]);
        });

        it('should skip undefined values', () => {
            expect(buildDomain(['top', 'refAreaLeft', 'bottom'], customerDomain)).toEqual([100, 0]);
        });

        it('should skip null values', () => {
            expect(buildDomain(['nullValue' as any, 'top'], customerDomain)).toEqual([null,100]);
        });

        it('should handle different value types', () => {
            expect(buildDomain(['animation', 'custom' as any], customerDomain)).toEqual([true, 'customValue']);
        });

        it('should preserve order of customDomain', () => {
            expect(buildDomain(['bottom', 'top', 'left'], customerDomain)).toEqual([0, 100, 1]);
        });

        it('should handle repeated keys', () => {
            expect(buildDomain(['top', 'top', 'bottom'], customerDomain)).toEqual([100, 100, 0]);
        });

        it('should return empty array if no keys exist', () => {
            expect(buildDomain(['notExist1' as any, 'notExist2' as any], customerDomain)).toEqual([]);
        });
    })
});

