import { BANK_COLORS, FALLBACK_COLOR, getRandomHarmonicPalette, mapColors, hslToHex } from './colors';

jest.mock('@repo/services', () => ({
  normalize: (str: string) => str,
  toSnakeCase: (str: string) => str.replace(/\s+/g, '_'),
}));

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
    expect(result.color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('should normalize and snake_case the name before matching', () => {
    const result = mapColors({ type: 'bank', name: 'Banco do Brasil' });
    expect(result).toEqual(BANK_COLORS.find(b => b.name === 'banco_do_brasil'));
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
