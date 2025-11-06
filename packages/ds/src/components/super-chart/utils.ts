import { CompareFilterParams, CompareFilterTooltipParams } from './types';

export function compareFilter({ param, value, condition }: CompareFilterParams) {
    if (!param) {
        return true;
    }
    if (!value) {
        return true;
    }
    if (!condition) {
        return true;
    }
    switch (condition) {
        case '===':
            return param === value;
        case '!==':
            return param !== value;
        case '>':
            return param > value;
        case '<':
            return param < value;
        case '>=':
            return param >= value;
        case '<=':
            return param <= value;
        default:
            return true;
    }
}


function CurrentValue({ by = 'value', value, label }: CompareFilterTooltipParams) {
    switch (by) {
        case 'label':
            return label;
        case 'value':
        default:
            return value;
    }
}

export function CompareFilterTooltip(props: CompareFilterTooltipParams){
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