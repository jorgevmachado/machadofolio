import type { CompareFilterParams } from './types';

function CurrentValue({ by = 'value', value, label }: CompareFilterParams) {
    switch (by) {
        case 'label':
            return label;
        case 'value':
        default:
            return value;
    }
}

export function compareFilter(props: CompareFilterParams){
    const {
        param,
        condition
    } = props

    const currentValue =  CurrentValue(props);


    if(condition === 'empty' && !param) {
        return false;
    }

    if (!param) {
        return true;
    }

    if (!condition) {
        return true;
    }

    switch (condition) {
        case '===':
            return param === currentValue;
        case '!==':
            return param !== currentValue;
        case '>':
            return param > (currentValue ?? 0);
        case '<':
            return param < (currentValue ?? 0);
        case '>=':
            return param >= (currentValue ?? 0);
        case '<=':
            return param <= (currentValue ?? 0);
        default:
            return true;
    }
}