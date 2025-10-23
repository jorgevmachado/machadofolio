import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';


jest.mock('recharts', () => {
    let index = 0;
    return {
        ResponsiveContainer: ({ children, ...props }: any) => (<div {...props} data-testid="mock-responsive-container">{children}</div>),
        PieChart: ({ children, ...props }: any) => (<div {...props} data-testid="mock-pie-chart-component">{children}</div>),
        Pie: ({ children, ...props }: any) => {
            if(props.label) {
                props.label('name', 1)
            }
            return <div {...props} data-testid="mock-pie">{children}</div>
        },
        Cell: (() => {
            index++
            return (
                <div data-testid={`mock-cell-${index}`}></div>
            )
        }),
        Tooltip: (props: any) => (<div {...props} data-testid="mock-tooltip"/>),
        Legend: () => (<div data-testid="mock-legend"></div>),
    }
});

import PieChart from './PieChart';

describe('<PieChart/>', () => {

    const mockData = [
        {
            name: 'Fixed',
            value: 100,
            count: 1,
            type: 'organic',
            percentageTotal: 350
        },
        {
            name: 'Variable',
            value: 250,
            count: 3,
            type: 'organic',
            percentageTotal: 350
        },
    ];

    const mockTooltipContent = jest.fn();

    const defaultProps = {
        data: mockData,
        tooltipContent: mockTooltipContent
    }

    const renderComponent = (props: any = {}) => {
        return render(<PieChart {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('ds-pie-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('mock-pie-chart-component')).toBeInTheDocument();
        expect(screen.getByTestId('mock-pie')).toBeInTheDocument();

        expect(screen.getByTestId(`mock-cell-1`)).toBeInTheDocument()
        expect(screen.getByTestId(`mock-cell-2`)).toBeInTheDocument()

        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('mock-legend')).toBeInTheDocument();
    });
});