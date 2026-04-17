import { convertToNumber } from '@repo/services';

import type { AxisDomain, TCustomDomain } from '../types';

import type { CustomDomainItem, GetAxisYDomainParams, UpdateDomainItemParams } from './types';

export const INITIAL_STATE: CustomDomainItem = {
    top: 'dataMax+1',
    top2: 'dataMax+20',
    left: 'dataMin',
    right: 'dataMax',
    bottom: 'dataMin-1',
    bottom2: 'dataMin-20',
    animation: true,
    refAreaLeft: undefined,
    refAreaRight: undefined,
};


export const getAxisYDomain = ({
                                   to,
                                   ref,
                                   data = [],
                                   from,
                                   offset
                               }: GetAxisYDomainParams) => {
    if (from != null && to != null) {
        if(data.length <= 0) {
            return [INITIAL_STATE.bottom, INITIAL_STATE.top];
        }

        const refData = data.slice(Number(from) - 1, Number(to));

        const { min, max } = refData.reduce((acc, item) => {
            const value = item?.[ref];
            if(!value) {
                return acc;
            }
            if (typeof value === 'number') {
                const max = convertToNumber(acc.max);
                const min = convertToNumber(acc.min);
                return {
                    min: acc.min === undefined ? value : Math.min(min, value),
                    max: acc.max === undefined ? value : Math.max(max, value),
                }
            }
            return acc;
        }, {
            min: INITIAL_STATE.bottom,
            max: INITIAL_STATE.top
        });

        const valueBottom = typeof min === 'number' ? min - offset : min;
        const valueTop = typeof max === 'number' ? max + offset : max;

        return [valueBottom, valueTop];
    }
    return [INITIAL_STATE.bottom, INITIAL_STATE.top];
}


export function updateDomainItem({ prev, data = [], labels = [] }: UpdateDomainItemParams): CustomDomainItem {
    const { refAreaLeft: leftInit, refAreaRight: rightInit } = prev;

    const ref1 = labels?.[0]?.dataKey;
    const ref2 = labels?.[1]?.dataKey;

    const defaultResult = {
        ...prev,
        refAreaLeft: undefined,
        refAreaRight: undefined,
    }

    if (!ref1) {
        return defaultResult;
    }

    if (!ref2) {
        return defaultResult;
    }

    if (leftInit === rightInit || rightInit === '') {
        return defaultResult;
    }

    const [refAreaLeft, refAreaRight] = (leftInit && rightInit && leftInit > rightInit)
        ? [rightInit, leftInit]
        : [leftInit, rightInit];


    const [bottom, top] = getAxisYDomain({
        to: refAreaRight,
        ref: ref1,
        data,
        from: refAreaLeft,
        offset: 1,
    });


    if (!bottom || !top) {
        return defaultResult;
    }

    const [bottom2, top2] = getAxisYDomain({
        to: refAreaRight,
        ref: ref2,
        data,
        from: refAreaLeft,
        offset: 50,
    });

    if (!bottom2 || !top2) {
        return defaultResult;
    }

    return {
        ...prev,
        top,
        top2,
        left: refAreaLeft ?? INITIAL_STATE.left,
        right: refAreaRight ?? INITIAL_STATE.right,
        bottom,
        bottom2,
        refAreaLeft: undefined,
        refAreaRight: undefined,
    };
}

export function buildDomain(customDomain: Array<TCustomDomain>, customerDomain: CustomDomainItem) {
    return customDomain
        .map((item) => customerDomain[item])
        .filter((f) => f !== undefined) as AxisDomain;
}