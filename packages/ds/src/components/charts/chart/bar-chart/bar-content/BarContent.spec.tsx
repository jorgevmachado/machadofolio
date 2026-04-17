import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('recharts', () => {
    let index = 0;
    return (
        {
            Bar: ({ children, radius, ...props }: any) => (<div {...props}>{children}</div>),
            Cell: ((props: any) => {
                index++
                return (
                    <div {...props} data-testid={`mock-cell-${index}`}></div>
                )
            }),
            LabelList: (props: any) => (
                <div data-testid="mock-label-list" {...props}>
                    {typeof props.content === 'function' ? props.content({}) : null}
                    {props.formatter && (
                        <>
                            <span data-testid="formatter-number">{props.formatter(1234)}</span>
                            <span data-testid="formatter-string">{props.formatter('not-a-number')}</span>
                        </>
                    )}
                </div>
            ),
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

    const defaultProps = {
        isVertical: true
    }

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
        expect(screen.queryByTestId('ds-bar-content-value-vertical')).not.toBeInTheDocument();
    });

    it('should render component with labels', () => {
        renderComponent({ labels: [{ key: 'value' }]});
        const component = screen.getByTestId('ds-bar-content-value-vertical');
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('fill', '#808080');
    });

    it('should render component with labels and fill', () => {
        renderComponent({ labels: [{ key: 'value', fill: '#fff'}]});
        const component = screen.getByTestId('ds-bar-content-value-vertical');
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('fill', '#fff');
    });

    it('should render component with data', () => {
        renderComponent({ data, labels: [{ key: 'value', fill: '#fff'}]});
        expect(screen.getByTestId('ds-bar-content-value-vertical')).toBeInTheDocument();

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
        expect(screen.getByTestId('ds-bar-content-value-vertical')).toBeInTheDocument();
        expect(screen.getByTestId('ds-bar-content-count-vertical')).toBeInTheDocument();
    });

    it('should render component with  active bar', () => {
        const labels = [
            { key: 'value', fill: '#9c44dc', activeBar: { type: 'rectangle' }},
        ]
        renderComponent({ data, labels});
        const component = screen.getByTestId('ds-bar-content-value-vertical')
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('activeBar', '[object Object]');
    });

    it('should render component with  label List', () => {
        const labels = [
            { key: 'value', fill: '#9c44dc', labelList: { dataKey: 'name', withContent: false }},
        ]
        renderComponent({ data, labels});
        expect(screen.getByTestId('ds-bar-content-value-vertical')).toBeInTheDocument();
        expect(screen.getByTestId('mock-label-list')).toBeInTheDocument();
    });

    it('should render component with  label List withContent', () => {
        const labels = [
            { key: 'value', fill: '#9c44dc', labelList: { dataKey: 'name', withContent: true }},
        ]
        renderComponent({ data, labels});
        expect(screen.getByTestId('ds-bar-content-value-vertical')).toBeInTheDocument();
        const labelListComponent = screen.getByTestId('mock-label-list');
        expect(labelListComponent).toBeInTheDocument();
    });

    it('should render component horizontal', () => {
        renderComponent({ isVertical: false, labels: [{ key: 'value', fill: '#808080' }] });
        expect(screen.getByTestId('ds-bar-content-value-horizontal')).toBeInTheDocument();
    });

    it('should return null if labels is empty', () => {
        const { container } = render(<BarContent isVertical data={[]} labels={[]} />);
        expect(container.firstChild).toBeNull();
    });

    it('should return null if labels is undefined', () => {
        const { container } = render(<BarContent isVertical data={[]} />);
        expect(container.firstChild).toBeNull();
    });

    it('should render with custom radius and background', () => {
        renderComponent({ labels: [{ key: 'value', fill: '#fff', radius: [1,2,3,4], background: { fill: '#eee' } }] });
        const component = screen.getByTestId('ds-bar-content-value-vertical');
        expect(component).toBeInTheDocument();
    });

    it('should render with minPointSize', () => {
        renderComponent({ labels: [{ key: 'value', fill: '#fff', minPointSize: 5 }] });
        const component = screen.getByTestId('ds-bar-content-value-vertical');
        expect(component).toHaveAttribute('minPointSize', '5');
    });

    it('should render with stackId and dataKey', () => {
        renderComponent({ labels: [{ key: 'value', fill: '#fff', stackId: 'stack', dataKey: 'value' }] });
        const component = screen.getByTestId('ds-bar-content-value-vertical');
        expect(component).toHaveAttribute('stackId', 'stack');
        expect(component).toHaveAttribute('dataKey', 'value');
    });

    it('should render cell with fallback fill and stroke', () => {
        renderComponent({ data: [{ type: 'bank', name: 'Test', value: 1 }], labels: [{ key: 'value' }] });
        const cells = screen.getAllByTestId(/^mock-cell-/);
        expect(cells[0]).toHaveAttribute('fill', '#fff');
        expect(cells[0]).toHaveAttribute('stroke', '#aaa');
    });

    it('should render labelList with withCustomContent', () => {
        const labels = [
            { key: 'value', fill: '#9c44dc', labelList: { dataKey: 'name', withCustomContent: true, fill: '#9c44dc' } },
        ];
        renderComponent({ data, labels });
        expect(screen.getByTestId('mock-label-list')).toBeInTheDocument();
    });

    it('should call custom content function when withCustomContent is true', () => {
        const labels = [
            { key: 'value', fill: '#9c44dc', labelList: { dataKey: 'name', withCustomContent: true } },
        ];
        renderComponent({ data, labels });
        expect(screen.getByTestId('mock-label-list-content')).toBeInTheDocument();
    });

    it('should use currencyFormatter when withCurrencyFormatter is true and no formatter is provided', () => {
        const labels = [
            { key: 'value', fill: '#9c44dc', labelList: { dataKey: 'value', withCurrencyFormatter: true } },
        ];
        renderComponent({ data: [{ type: 'bank', name: 'Test', value: 1234 }], labels });
        expect(screen.getByTestId('mock-label-list')).toBeInTheDocument();
    });

    it('should use currencyFormatter and return value as is for non-number', () => {
        const labels = [
            { key: 'value', fill: '#9c44dc', labelList: { dataKey: 'value', withCurrencyFormatter: true } },
        ];
        renderComponent({ data: [{ type: 'bank', name: 'Test', value: 'not-a-number' }], labels });
        expect(screen.getByTestId('mock-label-list')).toBeInTheDocument();
    });

    it('should use generated formatter for currency when withCurrencyFormatter is true and no formatter is provided', () => {
        const labels = [
            { key: 'value', fill: '#9c44dc', labelList: { dataKey: 'value', withCurrencyFormatter: true } },
        ];
        renderComponent({ data: [{ type: 'bank', name: 'Test', value: 1234 }], labels });
        const currencyFormatter = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const generatedFormatter = (value: any) => {
            if (typeof value === 'number') {
                return currencyFormatter(value);
            }
            return value;
        };
        expect(generatedFormatter(1234)).toBe('R$ 1.234,00');
        expect(generatedFormatter('not-a-number')).toBe('not-a-number');
    });

    it('should call formatter generated by withCurrencyFormatter and validate its output', () => {
        const labels = [
            { key: 'value', fill: '#9c44dc', labelList: { dataKey: 'value', withCurrencyFormatter: true } },
        ];
        renderComponent({ data: [{ type: 'bank', name: 'Test', value: 1234 }], labels });
        const formatted = screen.getByTestId('formatter-number').textContent;
        expect(formatted).toContain('R$');
        expect(formatted).toContain('1.234');
        const noSpaces = formatted?.replace(/\s/g, '');
        expect(noSpaces).toMatch(/^R\$1\.234(,00)?$/);
        expect(screen.getByTestId('formatter-string').textContent).toBe('not-a-number');
    });
})