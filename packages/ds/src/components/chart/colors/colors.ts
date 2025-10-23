import { toSnakeCase } from '@repo/services';

import type { ColorProps, TChartColor } from '../types';

export const FALLBACK_COLOR: ColorProps = {
    type: 'highlight',
    name: 'other',
    color: '#10b981'
}

export const BANK_COLORS: Array<ColorProps> = [
    {
        type: 'bank',
        name: 'nubank',
        color: '#8b5cf6'
    },
    {
        type: 'bank',
        name: 'caixa',
        color: '#3b82f6'
    },
    {
        type: 'bank',
        name: 'itau',
        color: '#f59e0b'
    },
    {
        type: 'bank',
        name: 'banco_do_brasil',
        color: '#FFD700'
    },
    {
        type: 'bank',
        name: 'santander',
        color: '#ef4444'
    }
];

export const HIGHLIGHT_COLORS: Array<ColorProps> = [
    {
        type: 'highlight',
        name: 'electric_blue',
        color: '#007BFF'
    },
    {
        type: 'highlight',
        name: 'emerald_green',
        color: '#28A745'
    },
    {
        type: 'highlight',
        name: 'vibrant_orange',
        color: '#FD7E14'
    },
    {
        type: 'highlight',
        name: 'deep_purple',
        color: '#6F42C1'
    },
    {
        type: 'highlight',
        name: 'intense_red',
        color: '#DC3545'
    }
];

export const HARMONY_COLORS: Array<ColorProps> = [
    {
        type: 'harmony',
        name: 'Azul Sereno',
        color: '#ADD8E6'
    },
    {
        type: 'harmony',
        name: 'Verde Menta',
        color: '#98FB98'
    },
    {
        type: 'harmony',
        name: 'Lavanda Suave',
        color: '#E6E6FA'
    },
    {
        type: 'harmony',
        name: 'Pêssego Claro',
        color: '#FFDAB9'
    },
    {
        type: 'harmony',
        name: 'Cinza Claro',
        color: '#D3D3D3'
    }
];

export const ORGANIC_COLORS: Array<ColorProps> = [
    {
        type: 'organic',
        name: 'Verde Floresta',
        color: '#228B22'
    },
    {
        type: 'organic',
        name: 'Marrom Terra',
        color: '#8B4513'
    },
    {
        type: 'organic',
        name: 'Azul Céu',
        color: '#87CEEB'
    },
    {
        type: 'organic',
        name: 'Areia',
        color: '#F4A460'
    },
    {
        type: 'organic',
        name: 'Verde Musgo',
        color: '#8FBC8F'
    }
];

export const EMPHASIS_COLORS: Array<ColorProps> = [
    {
        type: 'emphasis',
        name: 'Preto',
        color: '#000000'
    },
    {
        type: 'emphasis',
        name: 'Cinza Escuro',
        color: '#2F4F4F'
    },
    {
        type: 'emphasis',
        name: 'Cinza Médio',
        color: '#696969'
    },
    {
        type: 'emphasis',
        name: 'Cinza Claro',
        color: '#DCDCDC'
    },
    {
        type: 'emphasis',
        name: 'Branco',
        color: '#FFFFFF'
    }
];

export const DEFAULT_COLORS: Array<ColorProps> = [
    ...BANK_COLORS,
    ...HIGHLIGHT_COLORS,
    ...HARMONY_COLORS,
    ...ORGANIC_COLORS,
    ...EMPHASIS_COLORS
];

const getColors = (colors: Array<ColorProps>, type: TChartColor) => {
    const filteredByTypeColors = colors.filter((item) => item.type === type);
    if(filteredByTypeColors.length > 0) {
        return filteredByTypeColors;
    }
    switch(type) {
        case 'bank':
            return BANK_COLORS;
        case 'highlight':
            return HIGHLIGHT_COLORS;
        case 'harmony':
            return HARMONY_COLORS;
        case 'organic':
            return ORGANIC_COLORS;
        case 'emphasis':
            return EMPHASIS_COLORS;
        default:
            return DEFAULT_COLORS;
    }
}

export const mapColors = (
    name: string,
    index: number,
    type: TChartColor = 'default',
    colors: Array<ColorProps> = DEFAULT_COLORS
) => {
    const currentColors = getColors(colors, type);

    console.log('# => currentColors => ', currentColors);

    if(type === 'bank') {
        const currentName = toSnakeCase(name.toLowerCase());
        return (currentColors.find((item) => item.name === currentName) ?? FALLBACK_COLOR).color;
    }

    const defaultColors = currentColors.flatMap((item) => item.color);
    return defaultColors[index % currentColors.length];
}