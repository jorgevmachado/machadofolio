import React, { useEffect, useState } from 'react';

import { isNumberEven } from '@repo/services';

import { type TContext } from '../../../utils';
import Button from '../../button';

type NumberProps = {
    hide?: boolean;
    total: number;
    range?: number;
    context: TContext;
    selected: number;
    onClick: (page: number) => void;
}
export default function Numbers({ hide, range = 0, total, context, onClick, selected }: NumberProps) {
    const [numbers, setNumbers] = useState<Array<number>>([]);

    const buildStartEnd = (
        range: number,
        offset: number,
        selected: number,
        firstMiddlePoint: number,
        lastMiddlePoint: number
    ): Array<number> => {

        const numbers: Array<number> = [];

        const isInMiddleRange = selected > firstMiddlePoint && selected <= lastMiddlePoint;

        const isBeyondLastMiddlePoint = selected > lastMiddlePoint;

        const isPageRangeExceedingTotalPages = range > total;

        const start = isInMiddleRange
            ? selected - offset
            : isBeyondLastMiddlePoint
                ? total - ((range === 0 ? 1 : range) - 1)
                : 1;

        const end = isInMiddleRange
            ? isNumberEven(range)
                ? selected + offset - 1
                : selected + offset
            : isBeyondLastMiddlePoint
                ? total
                : isPageRangeExceedingTotalPages
                    ? total
                    : (range === 0 ? 1 : range);

        for (let i = start; i <= end; i++) {
            numbers.push(i);
        }
        return numbers;
    }

    useEffect(() => {

        const offset = Math.floor(range / 2);

        const firstMiddlePoint = 1 + offset;
        const lastMiddlePoint = total - offset;

        const currentNumbers = buildStartEnd(range, offset, selected, firstMiddlePoint, lastMiddlePoint);
        setNumbers(currentNumbers);
    }, []);

    if(hide) {
        return null;
    }

    return numbers.map((number) => (
        <Button
            key={`page-${number}`}
            type="button"
            onClick={() => onClick(number)}
            context={context}
            selected={selected === number}
            data-testid={`ds-pagination-numbers-${number}`}
        >{number}</Button>
    ));
}