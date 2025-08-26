import React, { useEffect, useState } from 'react'

import { type TContext } from '../../../utils';
import { ProgressIndicator } from '../../../elements';

type DotsProps = {
    hide?: boolean;
    total: number;
    limit?: boolean;
    context: TContext;
    selected: number;
}

export default function Dots({ hide, total, limit = false, context, selected }: DotsProps) {
    const [currentTotal, setCurrentTotal] = useState<number>(total);
    const [currentDot, setCurrentDot] = useState<number>(selected);

    useEffect(() => {
        const limitedTotalDots = 5;
        if(limit && total > limitedTotalDots) {
            const startMiddlePoint = 3;
            const endMiddlePoint = total - 1;
            setCurrentTotal(limitedTotalDots);

            if(selected > startMiddlePoint && selected < endMiddlePoint) {
                setCurrentDot(3);
                return;
            }

            if(selected === endMiddlePoint) {
                setCurrentDot(4);
                return;
            }

            if(selected === total) {
                setCurrentDot(5);
            }
            return;
        }
        setCurrentDot(selected);
    }, [selected, total, limit]);

    if(hide || total < 2) {
        return null;
    }

    return (
        <ProgressIndicator
            total={currentTotal}
            current={currentDot}
            context={context}
            data-testid="ds-pagination-dots"
        />
    )
}