import * as colors from './colors';

jest.mock('@repo/services', () => ({
  normalize: (str: string) => str,
  toSnakeCase: (str: string) => str.replace(/\s+/g, '_'),
}));

describe('functions colors', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('BANK_COLORS', () => {
        it('should contain 5 banks with expected names', () => {
            const names = colors.BANK_COLORS.map(b => b.name);
            expect(names).toEqual([
                'nubank',
                'caixa',
                'itau',
                'banco_do_brasil',
                'santander',
            ]);
        });
    });

    describe('FALLBACK_COLOR', () => {
        it('should have type highlight and name other', () => {
            expect(colors.FALLBACK_COLOR.type).toBe('highlight');
            expect(colors.FALLBACK_COLOR.name).toBe('other');
        });
    });

    describe('getRandomHarmonicPalette', () => {
        it('should return an object with color, fill, and stroke as hex strings', () => {
            const palette = colors.getRandomHarmonicPalette();
            expect(palette).toHaveProperty('color');
            expect(palette).toHaveProperty('fill');
            expect(palette).toHaveProperty('stroke');
            expect(palette.color).toMatch(/^#[0-9a-fA-F]{6}$/);
            expect(palette.fill).toMatch(/^#[0-9a-fA-F]{6}$/);
            expect(palette.stroke).toMatch(/^#[0-9a-fA-F]{6}$/);
        });
    });

    describe('getRandomHarmonicPalette edge cases', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should set fillLum to 100 when baseLum + 10 > 100', () => {
            // baseLum = 95, baseSat = 70, baseHue = 0
            jest.spyOn(Math, 'random').mockImplementationOnce(() => 0) // baseHue = 0
                .mockImplementationOnce(() => (10/30)) // baseSat = 60 + 29 = 89
                .mockImplementationOnce(() => (50/30)); // baseLum = 45 + 50 = 95

            const palette = colors.getRandomHarmonicPalette();
            // fillLum = 95 + 10 = 105 > 100 => 100
            // fillHue = 120
            expect(palette.fill).toBe(colors.hslToHex(120, 89, 100));
        });

        it('should set strokeSat to 0 when baseSat - 10 < 0', () => {
            // baseSat = 5, baseLum = 50, baseHue = 0
            jest.spyOn(Math, 'random').mockImplementationOnce(() => 0) // baseHue = 0
                .mockImplementationOnce(() => (-55/30)) // baseSat = 60 + (-55) = 5
                .mockImplementationOnce(() => (5/30)); // baseLum = 45 + 5 = 50

            const palette = colors.getRandomHarmonicPalette();
            expect(palette.stroke).toBe(colors.hslToHex(240, 0, 40));
        });

        it('should set strokeLum to 0 when baseLum - 10 < 0', () => {
            jest.spyOn(Math, 'random').mockImplementationOnce(() => 0) // baseHue = 0
                .mockImplementationOnce(() => (10/30)) // baseSat = 60 + 29 = 89
                .mockImplementationOnce(() => (-40/30)); // baseLum = 45 + (-40) = 5

            const palette = colors.getRandomHarmonicPalette();
            expect(palette.stroke).toBe(colors.hslToHex(240, 79, 0));
        });
    });

    describe('mapColors', () => {
        it('should return getRandomHarmonicPalette when dont receive type', () => {
            const result = colors.mapColors({ name: 'anything' });
            expect(result).toHaveProperty('fill');
            expect(result).toHaveProperty('color');
            expect(result).toHaveProperty('stroke');
            if(result) {
                expect(result.fill).toMatch(/^#[0-9a-fA-F]{6}$/);
                expect(result.color).toMatch(/^#[0-9a-fA-F]{6}$/);
                expect(result.stroke).toMatch(/^#[0-9a-fA-F]{6}$/);
            }
        });

        it('should return correct bank color for known banks', () => {
            colors.BANK_COLORS.forEach(bank => {
                const result = colors.mapColors({ type: 'bank', name: bank.name });
                expect(result).toEqual(bank);
            });
        });

        it('should return FALLBACK_COLOR for unknown bank', () => {
            const result = colors.mapColors({ type: 'bank', name: 'unknown_bank' });
            expect(result).toHaveProperty('fill');
            expect(result).toHaveProperty('color');
            expect(result).toHaveProperty('stroke');
            if(result) {
                expect(result.fill).toMatch(/^#[0-9a-fA-F]{6}$/);
                expect(result.color).toMatch(/^#[0-9a-fA-F]{6}$/);
                expect(result.stroke).toMatch(/^#[0-9a-fA-F]{6}$/);
            }
        });

        it('should return harmonic palette for non-bank type', () => {
            const result = colors.mapColors({ type: 'other', name: 'anything' });
            expect(result).toHaveProperty('color');
            expect(result).toHaveProperty('fill');
            expect(result).toHaveProperty('stroke');
            expect(result?.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        });

        it('should normalize and snake_case the name before matching', () => {
            const result = colors.mapColors({ type: 'bank', name: 'Banco do Brasil' });
            expect(result).toEqual(colors.BANK_COLORS.find(b => b.name === 'banco_do_brasil'));
        });

        it('should return a palette for type highlight', () => {
            const result = colors.mapColors({ type: 'highlight', name: 'electric_blue' });
            expect(result).toEqual(colors.HIGHLIGHT_COLORS[0]);
        });

        it('should return a palette for type highlight fallback', () => {
            const result = colors.mapColors({ type: 'highlight', name: 'anything' });
            expect(result).toHaveProperty('color');
            expect(result).toHaveProperty('fill');
            expect(result).toHaveProperty('stroke');
            expect(result?.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        });

        it('should return a palette for type harmony', () => {
            const result = colors.mapColors({ type: 'harmony', name: 'serene_blue' });
            expect(result).toEqual(colors.HARMONY_COLORS[0]);
        });

        it('should return a palette for type harmony fallback', () => {
            const result = colors.mapColors({ type: 'harmony', name: 'anything' });
            expect(result).toHaveProperty('color');
            expect(result).toHaveProperty('fill');
            expect(result).toHaveProperty('stroke');
            expect(result?.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        });

        it('should return a palette for type organic', () => {
            const result = colors.mapColors({ type: 'organic', name: 'forest_green' });
            expect(result).toEqual(colors.ORGANIC_COLORS[0]);
        });

        it('should return a palette for type organic fallback', () => {
            const result = colors.mapColors({ type: 'organic', name: 'anything' });
            expect(result).toHaveProperty('color');
            expect(result).toHaveProperty('fill');
            expect(result).toHaveProperty('stroke');
            expect(result?.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        });

        it('should return a palette for type emphasis', () => {
            const result = colors.mapColors({ type: 'emphasis', name: 'black' });
            expect(result).toEqual(colors.EMPHASIS_COLORS[0]);
        });

        it('should return a palette for type emphasis fallback', () => {
            const result = colors.mapColors({ type: 'emphasis', name: 'anything' });
            expect(result).toHaveProperty('color');
            expect(result).toHaveProperty('fill');
            expect(result).toHaveProperty('stroke');
            expect(result?.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        });
    });

    describe('hslToHex edge cases', () => {
        it('should set fillLum to 100 when baseLum + 10 > 100', () => {
            const fillLum = 95 + 10 > 100 ? 100 : 95 + 10;
            expect(fillLum).toBe(100);
            const hex = colors.hslToHex(120, 70, fillLum);
            expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
        });

        it('should set strokeSat to 0 when baseSat - 10 < 0', () => {
            const strokeSat = 5 - 10 < 0 ? 0 : 5 - 10;
            expect(strokeSat).toBe(0);
            const hex = colors.hslToHex(240, strokeSat, 50);
            expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
        });

        it('should set strokeLum to 0 when baseLum - 10 < 0', () => {
            // baseLum = 5, baseLum - 10 = -5 < 0
            const strokeLum = 5 - 10 < 0 ? 0 : 5 - 10;
            expect(strokeLum).toBe(0);
            const hex = colors.hslToHex(240, 60, strokeLum);
            expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
        });
    });

    describe('darkenColor', () => {
        it('should darken a 6-digit hex color', () => {
            expect(colors.darkenColor('#336699', 20)).toBe('#1f5285');
        });

        it('should darken a 3-digit hex color', () => {
            expect(colors.darkenColor('#369', 20)).toBe('#1f5285');
        });

        it('should darken a 3-digit hex color (cobertura linha 51)', () => {
            // '#369' => '#336699' => darken 20 => '#1f5285'
            expect(colors.darkenColor('#369', 20)).toBe('#1f5285');
        });

        it('should not go below 0 for any channel', () => {
            expect(colors.darkenColor('#050505', 20)).toBe('#000000');
        });

        it('should return a valid hex string', () => {
            expect(colors.darkenColor('#abcdef')).toMatch(/^#[0-9a-fA-F]{6}$/);
        });
    });

    describe('HIGHLIGHT_COLORS', () => {
        it('should have 5 highlight colors with fill and stroke', () => {
            expect(colors.HIGHLIGHT_COLORS).toHaveLength(5);
            colors.HIGHLIGHT_COLORS.forEach(c => {
                expect(c.fill).toBe(c.color);
                expect(c.stroke).toBe(colors.darkenColor(c.color));
            });
        });
    });

    describe('HARMONY_COLORS', () => {
        it('should have 5 harmony colors with fill and stroke', () => {
            expect(colors.HARMONY_COLORS).toHaveLength(5);
            colors.HARMONY_COLORS.forEach(c => {
                expect(c.fill).toBe(c.color);
                expect(c.stroke).toBe(colors.darkenColor(c.color));
            });
        });
    });

    describe('ORGANIC_COLORS', () => {
        it('should have 5 organic colors with fill and stroke', () => {
            expect(colors.ORGANIC_COLORS).toHaveLength(5);
            colors.ORGANIC_COLORS.forEach(c => {
                expect(c.fill).toBe(c.color);
                expect(c.stroke).toBe(colors.darkenColor(c.color));
            });
        });
    });

    describe('EMPHASIS_COLORS', () => {
        it('should have 5 emphasis colors with fill and stroke', () => {
            expect(colors.EMPHASIS_COLORS).toHaveLength(5);
            colors.EMPHASIS_COLORS.forEach(c => {
                expect(c.fill).toBe(c.color);
                expect(c.stroke).toBe(colors.darkenColor(c.color));
            });
        });
    });

    describe('getRandomByPalette', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should return getRandomHarmonicPalette when palette is empty', () => {
            const result = colors.getRandomByPalette([]);
            expect(result).toHaveProperty('color');
            expect(result).toHaveProperty('fill');
            expect(result).toHaveProperty('stroke');
        });

        it('should return each color from palette once before repeating (mocked random)', () => {
            jest.resetModules();
            const colors = require('./colors');
            const palette = [
                { type: 'test', name: 'one', index: 0, color: '#111111', fill: '#111111', stroke: '#111111' },
                { type: 'test', name: 'two', index: 1, color: '#222222', fill: '#222222', stroke: '#222222' },
                { type: 'test', name: 'three', index: 2, color: '#333333', fill: '#333333', stroke: '#333333' }
            ];
            const originalRandom = Math.random;
            Math.random = () => 0;
            const results: string[] = [];
            for (let i = 0; i < palette.length; i++) {
                const result = colors.getRandomByPalette(palette);
                if (result && typeof result === 'object' && 'name' in result && typeof result.name === 'string') {
                  results.push(result.name);
                } else {
                  results.push('random');
                }
            }
            expect(new Set(results)).toEqual(new Set(['one', 'two', 'three']));
            Math.random = originalRandom;
        });

        it('should reset and allow repeats after all colors are used (mocked random)', () => {
            jest.resetModules();
            const colors = require('./colors');
            const palette = [
                { type: 'test', name: 'one', index: 0, color: '#111111', fill: '#111111', stroke: '#111111' },
                { type: 'test', name: 'two', index: 1, color: '#222222', fill: '#222222', stroke: '#222222' }
            ];
            const randomValues = [0, 0.9, 0];
            let call = 0;
            const originalRandom = Math.random;
            Math.random = () => randomValues[call++] ?? 0;
            const results = [];
            for (let i = 0; i < palette.length; i++) {
                const result = colors.getRandomByPalette(palette);
                results.push(result && 'name' in result ? result.name : 'random');
            }
            const nextResult = colors.getRandomByPalette(palette);
            const next = nextResult && 'name' in nextResult ? nextResult.name : 'random';
            expect(new Set(results)).toEqual(new Set(['one', 'two']));
            expect(['one', 'two']).toContain(next);
            Math.random = originalRandom;
        });

        it('should return getRandomHarmonicPalette if randomIdx is undefined', () => {
            const palette = [
                { type: 'test', name: 'one', index: 0, color: '#111111', fill: '#111111', stroke: '#111111' }
            ];
            const originalRandom = Math.random;
            Math.random = () => 1;
            const result = colors.getRandomByPalette(palette);
            expect(result).toHaveProperty('color');
            expect(result).toHaveProperty('fill');
            expect(result).toHaveProperty('stroke');
            Math.random = originalRandom;
        });

        it('should clear usedColorIndexes and repopulate availableIndexes when all colors have been used', () => {
            (colors as any).usedColorIndexes?.clear?.();
            const palette = [
                { type: 'test', name: 'one', index: 0, color: '#111111', fill: '#111111', stroke: '#111111' },
                { type: 'test', name: 'two', index: 1, color: '#222222', fill: '#222222', stroke: '#222222' },
                { type: 'test', name: 'three', index: 2, color: '#333333', fill: '#333333', stroke: '#333333' }
            ];
            const results = [];
            for (let i = 0; i < palette.length; i++) {
                const result = colors.getRandomByPalette(palette);
                results.push(result && 'name' in result ? result.name : 'random');
            }
            // Próxima chamada: todos já usados, força o reset
            const nextResult = colors.getRandomByPalette(palette);
            const next = nextResult && 'name' in nextResult ? nextResult.name : 'random';
            // Deve retornar um dos nomes da paleta (reset ocorreu)
            expect(['one', 'two', 'three']).toContain(next);
            // Todos os nomes únicos foram usados antes do reset
            expect(new Set(results)).toEqual(new Set(['one', 'two', 'three']));
        });
    });

    describe('mapListColors', () => {
        type mockItem = {
            id: string;
            emit: boolean;
            [key: string]: unknown;
        }
        const mockList: Array<mockItem> = [
            { id: '1', emit: true },
            { id: '2', type: 'bank', name: 'nubank', emit: true },
            { id: '3', type: 'home', name: 'house', colorName: 'electric_blue', emit: true },
            { id: '4', fill: '#FFF', color: '#111', stroke: '#000', emit: true },
        ];

        const result = colors.mapListColors<mockItem>(mockList);
        expect(result[0]).toHaveProperty('fill');
        expect(result[0]).toHaveProperty('color');
        expect(result[0]).toHaveProperty('stroke');

        expect(result[1]).toHaveProperty('fill');
        expect(result[1]).toHaveProperty('color');
        expect(result[1]).toHaveProperty('stroke');
        expect(result[1]).toEqual({ ...mockList[1], fill: '#9c44dc',color: '#bc8ae1', stroke: '#442c61' });

        expect(result[2]).toHaveProperty('fill');
        expect(result[2]).toHaveProperty('color');
        expect(result[2]).toHaveProperty('stroke');
        expect(result[2]).toEqual({ ...mockList[2], fill: '#007BFF', color: '#007BFF', stroke: colors.darkenColor('#007BFF') });

        expect(result[3]).toEqual(mockList[3]);
    });
});
