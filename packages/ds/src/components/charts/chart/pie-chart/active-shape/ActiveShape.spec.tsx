import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('recharts', () => {
    const originalModule = jest.requireActual('recharts') as Record<string, any>;
    return {
        ...originalModule,
        Sector: ({'data-testid': dataTestId = 'mock-sector', ...props}: any) => (<div {...props} data-testid={dataTestId}/>),
    }
})

import ActiveShape from './ActiveShape';

describe('<ActiveShape/>', () => {
    const defaultProps = {
        cx: 375,
        cy: 187.5,
        fill: '#8884d8',
        value: 400,
        payload: {
            value: 400,
            name: 'Group A'
        },
    percent:  0.3333333333333333,
    midAngle:  60,
    endAngle:  120,
    startAngle:  0,
    innerRadius:  82.5,
    outerRadius:  110
};

    const renderComponent = (props: any = {}) => {
        return render(<ActiveShape {...defaultProps} {...props}/>)
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const componentText = screen.getByTestId('ds-pie-chart-active-shape-text');
        expect(componentText).toBeInTheDocument();
        expect(componentText).toHaveAttribute('dy', '8');

        const componentTextValue = screen.getByTestId('ds-pie-chart-active-shape-text-value');
        expect(componentTextValue).toBeInTheDocument();
        expect(componentTextValue).toHaveAttribute('fill', '#333');
        expect(componentTextValue).toHaveAttribute('y', '66.2564434701786');
    });

    it('should render component with midAngle negative', () => {
        renderComponent({ midAngle: 180 });
        const componentTextValue = screen.getByTestId('ds-pie-chart-active-shape-text-value');
        expect(componentTextValue).toBeInTheDocument();
        expect(componentTextValue).toHaveAttribute('fill', '#333');
        expect(componentTextValue).toHaveAttribute('y', '187.49999999999997');

    });
})