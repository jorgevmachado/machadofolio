import { normalize, toSnakeCase } from '@repo/services';

import type { ColorProps } from '../types';

export const BANK_COLORS: Array<ColorProps> = [
    {
        fill: '#bc8ae1',
        type: 'bank',
        name: 'nubank',
        color: '#9c44dc',
        stroke: '#442c61'
    },
    {
        fill: '#FF9933',
        type: 'bank',
        name: 'caixa',
        color: '#002060',
        stroke: '#3b82f6',

    },
    {
        fill: '#FF6200',
        type: 'bank',
        name: 'itau',
        color: '#F88104',
        stroke: '#004387'
    },
    {
        fill: '#0072bb',
        type: 'bank',
        name: 'banco_do_brasil',
        color: '#FFD700',
        stroke: '#808080',
    },
    {
        fill: '#c2c2c2',
        type: 'bank',
        name: 'santander',
        color: '#EA1D25',
        stroke: '#333333'
    }
];

export const FALLBACK_COLOR: ColorProps = {
    fill: '#6ee7b7',
    type: 'highlight',
    name: 'other',
    color: '#10b981',
    stroke: '#047857'
}

export function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const color = l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export function getRandomHarmonicPalette() {
    const baseHue = Math.floor(Math.random() * 360);
    const baseSat = 60 + Math.floor(Math.random() * 30); // 60-89
    const baseLum = 45 + Math.floor(Math.random() * 30); // 45-74

    const fillHue = (baseHue + 120) % 360;
    const strokeHue = (baseHue + 240) % 360;

    const color = hslToHex(baseHue, baseSat, baseLum);
    const fill = hslToHex(fillHue, baseSat, baseLum + 10 > 100 ? 100 : baseLum + 10);
    const stroke = hslToHex(strokeHue, baseSat - 10 < 0 ? 0 : baseSat - 10, baseLum - 10 < 0 ? 0 : baseLum - 10);

    return {
        color,
        fill,
        stroke
    };
}

export function mapColors(item: { type: string; name: string; }) {
    if(item.type === 'bank') {
        const currentName = toSnakeCase(normalize(item.name.toLowerCase()));
        return BANK_COLORS.find(bank => bank.name === currentName) ?? FALLBACK_COLOR;
    }
    return getRandomHarmonicPalette();
}