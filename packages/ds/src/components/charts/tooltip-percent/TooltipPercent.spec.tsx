import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

import TooltipPercent from './TooltipPercent';

describe('<TooltipPercent/>', () => {
    const defaultProps = {
        label: 2015.07,
        payload: [
            {
                fill: '#8884d8',
                name: 'a',
                hide: false,
                value: 3490,
                color: '#8884d8',
                stroke: '#8884d8',
                dataKey: 'a',
                payload: {
                    a: 3490,
                    b: 4300,
                    c: 2100,
                    name: 'month-7',
                    month: '2015.07',
                },
            },
            {
                fill: '#82ca9d',
                name: 'b',
                hide: false,
                value: 4300,
                color: '#82ca9d',
                stroke: '#82ca9d',
                dataKey: 'b',
                payload: {
                    a: 3490,
                    b: 4300,
                    c: 2100,
                    name: 'month-7',
                    month: '2015.07',
                },
            },
            {
                fill: '#ffc658',
                name: 'c',
                hide: false,
                value: 2100,
                color: '#ffc658',
                stroke: '#ffc658',
                dataKey: 'c',
                payload: {
                    a: 3490,
                    b: 4300,
                    c: 2100,
                    name: 'month-7',
                    month: '2015.07',
                },
            }
        ]
    }

    const renderComponent = (props: any = {}) => {
        return render(<TooltipPercent {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('ds-area-chart-tooltip-percent')).toBeInTheDocument();
        const componentText = screen.getByTestId('ds-area-chart-tooltip-percent-text');
        expect(componentText).toBeInTheDocument();
        expect(componentText).toHaveTextContent('2015.07 (Total: 9890)');

        const itemElement0 = screen.getByTestId('ds-area-chart-tooltip-percent-list-item-0');
        expect(itemElement0).toBeInTheDocument();
        expect(itemElement0).toHaveTextContent('a: 3490 (35%)');

        const itemElement1 = screen.getByTestId('ds-area-chart-tooltip-percent-list-item-1');
        expect(itemElement1).toBeInTheDocument();
        expect(itemElement1).toHaveTextContent('b: 4300 (43%)');

        const itemElement2 = screen.getByTestId('ds-area-chart-tooltip-percent-list-item-2');
        expect(itemElement2).toBeInTheDocument();
        expect(itemElement2).toHaveTextContent('c: 2100 (21%)');
    });
});