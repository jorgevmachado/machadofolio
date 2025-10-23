import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

import { mapColors } from './colors';

jest.mock('@repo/services', () => ({
    toSnakeCase: jest.fn((value: string) => value.replace(/\s+/g, '-').toLowerCase()),
}));

describe('chart colors', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('mapColors', () => {
        it('should return color with type default', () => {
            const result = mapColors('default', 0, undefined, undefined);
            expect(result).toEqual('#8b5cf6');
        });

        it('should return color with default type and colors', () => {
            const result = mapColors('highlight', 0, 'highlight');
            expect(result).toEqual('#007BFF');
        });

        it('should return color with type bank', () => {
            const result = mapColors('nubank', 0, 'bank', []);
            expect(result).toEqual('#10b981');
        });

        it('should return color with type highlight', () => {
            const result = mapColors('highlight', 0, 'highlight', []);
            expect(result).toEqual('#007BFF');
        });

        it('should return color with type harmony', () => {
            const result = mapColors('harmony', 0, 'harmony', []);
            expect(result).toEqual('#ADD8E6');
        });

        it('should return color with type organic', () => {
            const result = mapColors('organic', 0, 'organic', []);
            expect(result).toEqual('#228B22');
        });

        it('should return color with type emphasis', () => {
            const result = mapColors('emphasis', 0, 'emphasis', []);
            expect(result).toEqual('#000000');
        });

        it('should return FALLBACK_COLOR when bank name does not exist', () => {
            const result = mapColors('nonexistent-bank', 0, 'bank', []);
            expect(result).toEqual('#10b981'); // FALLBACK_COLOR.color
        });
    });
});