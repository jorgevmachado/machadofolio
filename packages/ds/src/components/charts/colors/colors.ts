import { normalize, toSnakeCase } from '@repo/services';

import type { ColorProps } from '../types';

export const BANK_COLORS: Array<ColorProps> = [
    {
        type: 'bank',
        name: 'nubank',
        fill: '#9c44dc',
        color: '#bc8ae1',
        stroke: '#442c61',
    },
    {
        type: 'bank',
        name: 'caixa',
        fill: '#002060',
        color: '#FF9933',
        stroke: '#3b82f6'

    },
    {
        type: 'bank',
        name: 'itau',
        fill: '#F88104',
        color: '#FF6200',
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
        type: 'bank',
        name: 'santander',
        fill: '#EA1D25',
        color: '#c2c2c2',
        stroke: '#333333'
    }
];

export function darkenColor(hex: string, amount: number = 20): string {
    const col = hex.replace('#', '').length === 3
        ? hex.replace('#', '').split('').map(c => c + c).join('')
        : hex.replace('#', '');
    const num = parseInt(col, 16);
    const r = Math.max(0, ((num >> 16) - amount));
    const g = Math.max(0, (((num >> 8) & 0x00FF) - amount));
    const b = Math.max(0, ((num & 0x0000FF) - amount));
    return '#' + ((r << 16 | g << 8 | b).toString(16).padStart(6, '0'));
}

export const HIGHLIGHT_COLORS: Array<ColorProps> = [
    {
        type: 'highlight',
        name: 'electric_blue',
        color: '#007BFF',
        fill: '#007BFF',
        stroke: darkenColor('#007BFF')
    },
    {
        type: 'highlight',
        name: 'emerald_green',
        color: '#28A745',
        fill: '#28A745',
        stroke: darkenColor('#28A745')
    },
    {
        type: 'highlight',
        name: 'vibrant_orange',
        color: '#FD7E14',
        fill: '#FD7E14',
        stroke: darkenColor('#FD7E14')
    },
    {
        type: 'highlight',
        name: 'deep_purple',
        color: '#6F42C1',
        fill: '#6F42C1',
        stroke: darkenColor('#6F42C1')
    },
    {
        type: 'highlight',
        name: 'intense_red',
        color: '#DC3545',
        fill: '#DC3545',
        stroke: darkenColor('#DC3545')
    }
];

export const HARMONY_COLORS: Array<ColorProps> = [
    {
        type: 'harmony',
        name: 'serene_blue',
        color: '#ADD8E6',
        fill: '#ADD8E6',
        stroke: darkenColor('#ADD8E6')
    },
    {
        type: 'harmony',
        name: 'mint_green',
        color: '#98FB98',
        fill: '#98FB98',
        stroke: darkenColor('#98FB98')
    },
    {
        type: 'harmony',
        name: 'soft_lavender',
        color: '#E6E6FA',
        fill: '#E6E6FA',
        stroke: darkenColor('#E6E6FA')
    },
    {
        type: 'harmony',
        name: 'light_peach',
        color: '#FFDAB9',
        fill: '#FFDAB9',
        stroke: darkenColor('#FFDAB9')
    },
    {
        type: 'harmony',
        name: 'light_gray',
        color: '#D3D3D3',
        fill: '#D3D3D3',
        stroke: darkenColor('#D3D3D3')
    }
];

export const ORGANIC_COLORS: Array<ColorProps> = [
    {
        type: 'organic',
        name: 'forest_green',
        color: '#228B22',
        fill: '#228B22',
        stroke: darkenColor('#228B22')
    },
    {
        type: 'organic',
        name: 'earth_brown',
        color: '#8B4513',
        fill: '#8B4513',
        stroke: darkenColor('#8B4513')
    },
    {
        type: 'organic',
        name: 'sky_blue',
        color: '#87CEEB',
        fill: '#87CEEB',
        stroke: darkenColor('#87CEEB')
    },
    {
        type: 'organic',
        name: 'sand',
        color: '#F4A460',
        fill: '#F4A460',
        stroke: darkenColor('#F4A460')
    },
    {
        type: 'organic',
        name: 'moss_green',
        color: '#8FBC8F',
        fill: '#8FBC8F',
        stroke: darkenColor('#8FBC8F')
    }
];

export const EMPHASIS_COLORS: Array<ColorProps> = [
    {
        type: 'emphasis',
        name: 'black',
        color: '#000000',
        fill: '#000000',
        stroke: darkenColor('#000000')
    },
    {
        type: 'emphasis',
        name: 'dark_gray',
        color: '#2F4F4F',
        fill: '#2F4F4F',
        stroke: darkenColor('#2F4F4F')
    },
    {
        type: 'emphasis',
        name: 'medium_gray',
        color: '#696969',
        fill: '#696969',
        stroke: darkenColor('#696969')
    },
    {
        type: 'emphasis',
        name: 'light_gray',
        color: '#DCDCDC',
        fill: '#DCDCDC',
        stroke: darkenColor('#DCDCDC')
    },
    {
        type: 'emphasis',
        name: 'white',
        color: '#FFFFFF',
        fill: '#FFFFFF',
        stroke: darkenColor('#FFFFFF')
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
    const baseSat = 60 + Math.floor(Math.random() * 30);
    const baseLum = 45 + Math.floor(Math.random() * 30);

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
    const currentName = toSnakeCase(normalize(item.name.toLowerCase()));
    switch (item.type) {
        case 'bank':
            return BANK_COLORS.find(bank => bank.name === currentName) ?? FALLBACK_COLOR;
        case 'highlight':
            return HIGHLIGHT_COLORS.find(highlight => highlight.name === currentName) ?? HIGHLIGHT_COLORS[0];
        case 'harmony':
            return HARMONY_COLORS.find(harmony => harmony.name === currentName) ?? HARMONY_COLORS[0];
        case 'organic':
            return ORGANIC_COLORS.find(organic => organic.name === currentName) ?? ORGANIC_COLORS[0];
        case 'emphasis':
            return EMPHASIS_COLORS.find(emphasis => emphasis.name === currentName) ?? EMPHASIS_COLORS[0];
        default:
            return getRandomHarmonicPalette();
    }
}