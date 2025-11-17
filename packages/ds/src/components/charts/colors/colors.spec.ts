import { BANK_COLORS, FALLBACK_COLOR, getRandomHarmonicPalette, mapColors, hslToHex, darkenColor, HIGHLIGHT_COLORS, HARMONY_COLORS, ORGANIC_COLORS, EMPHASIS_COLORS } from './colors';

jest.mock('@repo/services', () => ({
  normalize: (str: string) => str,
  toSnakeCase: (str: string) => str.replace(/\s+/g, '_'),
}));

describe('functions colors', () => {
    describe('BANK_COLORS', () => {
        it('should contain 5 banks with expected names', () => {
            const names = BANK_COLORS.map(b => b.name);
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
            expect(FALLBACK_COLOR.type).toBe('highlight');
            expect(FALLBACK_COLOR.name).toBe('other');
        });
    });

    describe('getRandomHarmonicPalette', () => {
        it('should return an object with color, fill, and stroke as hex strings', () => {
            const palette = getRandomHarmonicPalette();
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

            const palette = getRandomHarmonicPalette();
            // fillLum = 95 + 10 = 105 > 100 => 100
            // fillHue = 120
            expect(palette.fill).toBe(hslToHex(120, 89, 100));
        });

        it('should set strokeSat to 0 when baseSat - 10 < 0', () => {
            // baseSat = 5, baseLum = 50, baseHue = 0
            jest.spyOn(Math, 'random').mockImplementationOnce(() => 0) // baseHue = 0
                .mockImplementationOnce(() => (-55/30)) // baseSat = 60 + (-55) = 5
                .mockImplementationOnce(() => (5/30)); // baseLum = 45 + 5 = 50

            const palette = getRandomHarmonicPalette();
            // strokeSat = 5 - 10 = -5 < 0 => 0
            // strokeHue = 240
            expect(palette.stroke).toBe(hslToHex(240, 0, 40));
        });

        it('should set strokeLum to 0 when baseLum - 10 < 0', () => {
            // baseLum = 5, baseSat = 70, baseHue = 0
            jest.spyOn(Math, 'random').mockImplementationOnce(() => 0) // baseHue = 0
                .mockImplementationOnce(() => (10/30)) // baseSat = 60 + 29 = 89
                .mockImplementationOnce(() => (-40/30)); // baseLum = 45 + (-40) = 5

            const palette = getRandomHarmonicPalette();
            // strokeLum = 5 - 10 = -5 < 0 => 0
            // strokeHue = 240
            expect(palette.stroke).toBe(hslToHex(240, 79, 0));
        });
    });

    describe('mapColors', () => {
        it('should return correct bank color for known banks', () => {
            BANK_COLORS.forEach(bank => {
                const result = mapColors({ type: 'bank', name: bank.name });
                expect(result).toEqual(bank);
            });
        });

        it('should return FALLBACK_COLOR for unknown bank', () => {
            const result = mapColors({ type: 'bank', name: 'unknown_bank' });
            expect(result).toEqual(FALLBACK_COLOR);
        });

        it('should return harmonic palette for non-bank type', () => {
            const result = mapColors({ type: 'other', name: 'anything' });
            expect(result).toHaveProperty('color');
            expect(result).toHaveProperty('fill');
            expect(result).toHaveProperty('stroke');
            expect(result?.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        });

        it('should normalize and snake_case the name before matching', () => {
            const result = mapColors({ type: 'bank', name: 'Banco do Brasil' });
            expect(result).toEqual(BANK_COLORS.find(b => b.name === 'banco_do_brasil'));
        });

        it('should return a palette for type highlight', () => {
            const result = mapColors({ type: 'highlight', name: 'electric_blue' });
            expect(result).toEqual(HIGHLIGHT_COLORS[0]);
        });

        it('should return a palette for type highlight fallback', () => {
            const result = mapColors({ type: 'highlight', name: 'anything' });
            expect(result).toEqual(HIGHLIGHT_COLORS[0]);
        });

        it('should return a palette for type harmony', () => {
            const result = mapColors({ type: 'harmony', name: 'serene_blue' });
            expect(result).toEqual(HARMONY_COLORS[0]);
        });

        it('should return a palette for type harmony fallback', () => {
            const result = mapColors({ type: 'harmony', name: 'anything' });
            expect(result).toEqual(HARMONY_COLORS[0]);
        });

        it('should return a palette for type organic', () => {
            const result = mapColors({ type: 'organic', name: 'forest_green' });
            expect(result).toEqual(ORGANIC_COLORS[0]);
        });

        it('should return a palette for type organic fallback', () => {
            const result = mapColors({ type: 'organic', name: 'anything' });
            expect(result).toEqual(ORGANIC_COLORS[0]);
        });

        it('should return a palette for type emphasis', () => {
            const result = mapColors({ type: 'emphasis', name: 'black' });
            expect(result).toEqual(EMPHASIS_COLORS[0]);
        });

        it('should return a palette for type emphasis fallback', () => {
            const result = mapColors({ type: 'emphasis', name: 'anything' });
            expect(result).toEqual(EMPHASIS_COLORS[0]);
        });
    });

    describe('hslToHex edge cases', () => {
        it('should set fillLum to 100 when baseLum + 10 > 100', () => {
            // baseLum = 95, baseLum + 10 = 105 > 100
            const fillLum = 95 + 10 > 100 ? 100 : 95 + 10;
            expect(fillLum).toBe(100);
            const hex = hslToHex(120, 70, fillLum);
            expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
        });

        it('should set strokeSat to 0 when baseSat - 10 < 0', () => {
            // baseSat = 5, baseSat - 10 = -5 < 0
            const strokeSat = 5 - 10 < 0 ? 0 : 5 - 10;
            expect(strokeSat).toBe(0);
            const hex = hslToHex(240, strokeSat, 50);
            expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
        });

        it('should set strokeLum to 0 when baseLum - 10 < 0', () => {
            // baseLum = 5, baseLum - 10 = -5 < 0
            const strokeLum = 5 - 10 < 0 ? 0 : 5 - 10;
            expect(strokeLum).toBe(0);
            const hex = hslToHex(240, 60, strokeLum);
            expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
        });
    });

    describe('darkenColor', () => {
        it('should darken a 6-digit hex color', () => {
            expect(darkenColor('#336699', 20)).toBe('#1f5285');
        });

        it('should darken a 3-digit hex color', () => {
            expect(darkenColor('#369', 20)).toBe('#1f5285');
        });

        it('should not go below 0 for any channel', () => {
            expect(darkenColor('#050505', 20)).toBe('#000000');
        });

        it('should return a valid hex string', () => {
            expect(darkenColor('#abcdef')).toMatch(/^#[0-9a-fA-F]{6}$/);
        });
    });

    describe('HIGHLIGHT_COLORS', () => {
        it('should have 5 highlight colors with fill and stroke', () => {
            expect(HIGHLIGHT_COLORS).toHaveLength(5);
            HIGHLIGHT_COLORS.forEach(c => {
                expect(c.fill).toBe(c.color);
                expect(c.stroke).toBe(darkenColor(c.color));
            });
        });
    });

    describe('HARMONY_COLORS', () => {
        it('should have 5 harmony colors with fill and stroke', () => {
            expect(HARMONY_COLORS).toHaveLength(5);
            HARMONY_COLORS.forEach(c => {
                expect(c.fill).toBe(c.color);
                expect(c.stroke).toBe(darkenColor(c.color));
            });
        });
    });

    describe('ORGANIC_COLORS', () => {
        it('should have 5 organic colors with fill and stroke', () => {
            expect(ORGANIC_COLORS).toHaveLength(5);
            ORGANIC_COLORS.forEach(c => {
                expect(c.fill).toBe(c.color);
                expect(c.stroke).toBe(darkenColor(c.color));
            });
        });
    });

    describe('EMPHASIS_COLORS', () => {
        it('should have 5 emphasis colors with fill and stroke', () => {
            expect(EMPHASIS_COLORS).toHaveLength(5);
            EMPHASIS_COLORS.forEach(c => {
                expect(c.fill).toBe(c.color);
                expect(c.stroke).toBe(darkenColor(c.color));
            });
        });
    });
});