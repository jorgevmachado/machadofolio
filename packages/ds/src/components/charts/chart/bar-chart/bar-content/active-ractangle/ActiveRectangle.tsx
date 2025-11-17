import React from 'react';

import { Rectangle } from 'recharts';

import type { ActiveBar } from '../../types';

type RectangleProps = React.ComponentProps<typeof Rectangle>;

type ActiveRectangleProps = RectangleProps & {
    activeBar?: ActiveBar;
};

export default function ActiveRectangle({
    fill,
    color,
    stroke,
    activeBar,
    ...props
}: ActiveRectangleProps) {
    const dynamicFill = activeBar?.fill || color || fill;
    const dynamicStroke = activeBar?.stroke || stroke || dynamicFill;
    return (
        <Rectangle
            {...props}
            fill={dynamicFill}
            style={{ filter: `drop-shadow(0 0 6px ${dynamicFill})` }}
            stroke={dynamicStroke}
            strokeWidth={3}
        />
    );
}