import React from 'react';

import { CustomizeLabelParams } from '../types';

type CustomizedLabelProps = CustomizeLabelParams;

export default function CustomizedLabel({
                                            x,
                                            y,
                                            value,
                                            stroke,
                                            customLabel
                                        }: CustomizedLabelProps) {

    const dy = customLabel?.dy || -4;
    const fill = customLabel?.fill || stroke;
    const fontSize = customLabel?.fontSize || 10;
    const textAnchor = customLabel?.textAnchor || 'middle';

    return (
        <text
            x={x}
            y={y}
            dy={dy}
            fill={fill}
            fontSize={fontSize}
            textAnchor={textAnchor}
            data-testid="ds-line-chart-customized-label-text"
        >
            {value}
        </text>
    );
}