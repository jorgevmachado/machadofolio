import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('recharts', () => {
    let index = 0;
    return (
        {
            Bar: ({ children }: any) => (<div data-testid="mock-bar">{children}</div>),
            Cell: (() => {
                index++
                return (
                    <div data-testid={`mock-cell-${index}`}></div>
                )
            }),
            LabelList: () => (<div data-testid="mock-label-list"></div>),
            Legend: () => (<div data-testid="mock-legend"></div>),
        }
    )
});

import BarChartContent from './BarChartContent';


describe('<BarChartContent/>', () => {
    const mockData = [
        {
            type: 'bank',
            name: 'Nubank',
            value: 400,
            count: 4
        },
        {
            type: 'bank',
            name: 'Caixa',
            value: 300,
            count: 3
        },
        {
            type: 'bank',
            name: 'Itaú',
            value: 200,
            count: 2
        },
        {
            type: 'bank',
            name: 'Santander',
            value: 100,
            count: 1
        },
    ]
    const defaultProps = {
        data: mockData,
        isVertical: false,
    };

    const renderComponent = (props: any = {}) => {
        return render(<BarChartContent {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('mock-bar')).toBeInTheDocument();
    });

    it('should render component with props isVertical.', () => {
        renderComponent({ isVertical: true });
        expect(screen.getByTestId('mock-bar')).toBeInTheDocument();
        expect(screen.getByTestId('mock-label-list')).toBeInTheDocument();
        expect(screen.getByTestId('mock-legend')).toBeInTheDocument();
        expect(screen.getByTestId(`mock-cell-1`)).toBeInTheDocument()
        expect(screen.getByTestId(`mock-cell-2`)).toBeInTheDocument()
        expect(screen.getByTestId(`mock-cell-3`)).toBeInTheDocument()
        expect(screen.getByTestId(`mock-cell-4`)).toBeInTheDocument()
    })
});