import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('recharts', () => {
    let index = 0;
    return (
        {
            Bar: ({ dataKey, children, ...props }: any) => (<div {...props} data-testid={`mock-bar-${dataKey}`}>{children}</div>),
            Cell: ((props: any) => {
                index++
                return (
                    <div {...props} data-testid={`mock-cell-${index}`}></div>
                )
            }),
            LabelList: (props: any) => (<div {...props} data-testid="mock-label-list"></div>),
        }
    )
});

jest.mock('./active-ractangle', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-active-rectangle"></div>),
    ActiveRectangle: (props: any) => (<div {...props} data-testid="mock-active-rectangle"></div>),
}));

jest.mock('./label-list-content', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-label-list-content"></div>),
    LabelListContent: (props: any) => (<div {...props} data-testid="mock-label-list-content"></div>),
}));

import BarContent from './BarContent';

jest.mock('../../../colors');

import * as colors from '../../../colors';

describe('<BarContent/>', () => {
    const data = [
        {
            type: 'bank',
            name: 'Nubank',
            value: 400,
            count: 4,
            fill: '#9c44dc',
            color: '#bc8ae1',
            stroke: '#442c61',
        },
        {
            type: 'bank',
            name: 'Caixa',
            value: 300,
            count: 3,
        },
        {
            type: 'bank',
            name: 'Itaú',
            value: 200,
            count: 2,
        },
        {
            type: 'bank',
            name: 'Santander',
            value: 100,
            count: 1,
        },
    ];

    const defaultProps = {}

    const renderComponent = (props: any = {}) => {
        render(<BarContent {...defaultProps} {...props}/>)
    }

    beforeEach(() => {
        jest.spyOn(colors, 'getRandomHarmonicPalette').mockImplementation(() => ({ color: '#000', fill: '#fff', stroke: '#aaa'}));
    })

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.queryByTestId('mock-bar-value')).not.toBeInTheDocument();
    });

    it('should render component with labels', () => {
        renderComponent({ labels: [{ key: 'value' }]});
        const component = screen.getByTestId('mock-bar-value');
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('fill', '#808080');
    });

    it('should render component with labels and fill', () => {
        renderComponent({ labels: [{ key: 'value', fill: '#fff'}]});
        const component = screen.getByTestId('mock-bar-value');
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('fill', '#fff');
    });

    it('should render component with data', () => {
        renderComponent({ data, labels: [{ key: 'value', fill: '#fff'}]});
        expect(screen.getByTestId('mock-bar-value')).toBeInTheDocument();

        const cellComponent1 = screen.getByTestId(`mock-cell-1`);
        expect(cellComponent1).toBeInTheDocument();
        expect(cellComponent1).toHaveAttribute('fill', '#9c44dc');
        expect(cellComponent1).toHaveAttribute('stroke', '#442c61');

        const cellComponent2 = screen.getByTestId(`mock-cell-2`);
        expect(cellComponent2).toBeInTheDocument();
        expect(cellComponent2).toHaveAttribute('fill', '#fff');
        expect(cellComponent2).toHaveAttribute('stroke', '#aaa');

        const cellComponent3 = screen.getByTestId(`mock-cell-3`);
        expect(cellComponent3).toBeInTheDocument();
        expect(cellComponent3).toHaveAttribute('fill', '#fff');
        expect(cellComponent3).toHaveAttribute('stroke', '#aaa');

        const cellComponent4 = screen.getByTestId(`mock-cell-4`);
        expect(cellComponent4).toBeInTheDocument();
        expect(cellComponent4).toHaveAttribute('fill', '#fff');
        expect(cellComponent4).toHaveAttribute('stroke', '#aaa');

    });

    it('should render component with multiples labels', () => {
        const labels = [
            { key: 'value', fill: '#9c44dc'},
            { key: 'count', fill: '#442c61'},
        ]
        renderComponent({ data, labels});
        expect(screen.getByTestId('mock-bar-value')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-count')).toBeInTheDocument();
    });

    it('should render component with  active bar', () => {
        const labels = [
            { key: 'value', fill: '#9c44dc', activeBar: { type: 'rectangle' }},
        ]
        renderComponent({ data, labels});
        const component = screen.getByTestId('mock-bar-value')
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('activeBar', '[object Object]');
    });

    it('should render component with  label List', () => {
        const labels = [
            { key: 'value', fill: '#9c44dc', labelList: { dataKey: 'name', withContent: false }},
        ]
        renderComponent({ data, labels});
        expect(screen.getByTestId('mock-bar-value')).toBeInTheDocument();
        expect(screen.getByTestId('mock-label-list')).toBeInTheDocument();
    });

    it('should render component with  label List withContent', () => {
        const labels = [
            { key: 'value', fill: '#9c44dc', labelList: { dataKey: 'name', withContent: true }},
        ]
        renderComponent({ data, labels});
        expect(screen.getByTestId('mock-bar-value')).toBeInTheDocument();
        const labelListComponent = screen.getByTestId('mock-label-list');
        expect(labelListComponent).toBeInTheDocument();
        expect(labelListComponent).toHaveAttribute('content', '[object Object]');
    });
})