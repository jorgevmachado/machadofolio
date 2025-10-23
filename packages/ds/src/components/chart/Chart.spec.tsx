import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../../utils', () => {
    const originalModule = jest.requireActual('../../utils') as Record<string, any>;
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
    }
});

jest.mock('../../elements', () => ({
    Text: (props: any) => (<p {...props}/>),
}));

jest.mock('./chart-wrapper', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-chart-wrapper"/>),
    ChartWrapper: (props: any) => (<div {...props} data-testid="mock-chart-wrapper"/>),
}));

jest.mock('./bar-chart', () => ({
    __esModule: true,
    default: (props: any) => {
        if(props.tooltipContent) {
            props.tooltipContent({});
        }
        return (
            <div {...props} data-testid="mock-bar-chart"/>
        )
    },
    BarChart: (props: any) => {
        if(props.tooltipContent) {
            props.tooltipContent({});
        }
        return (
            <div {...props} data-testid="mock-bar-chart"/>
        )
    },
}));

jest.mock('./pie-chart', () => ({
    __esModule: true,
    default: (props: any) => {
        if(props.tooltipContent) {
            props.tooltipContent({});
        }
        return (<div {...props} data-testid="mock-pie-chart"/>)
    },
    PieChart: (props: any) => {
        if(props.tooltipContent) {
            props.tooltipContent({});
        }
        return (<div {...props} data-testid="mock-pie-chart"/>)
    },
}));

jest.mock('./chart-tooltip', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-chart-tooltip"/>),
    ChartTooltip: (props: any) => (<div {...props} data-testid="mock-chart-tooltip"/>),
}));

jest.mock('./colors/colors', () => ({
    mapColors: jest.fn(() => '#FFF'),
}))

import Chart from './Chart';

describe('<Chart/>', () => {

    const mockBarData = [
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
    ];
    const mockPieData = [
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

    const defaultProps = {
        type: 'bar',
        data: [],
        title: 'Title',
        fallback: 'Never to late',
        className: 'custom-class',
    };

    const renderComponent = (props: any = {}) => {
        return render(<Chart {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with fallback.', () => {
        renderComponent();
        expect(screen.getByTestId('mock-chart-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-title')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-fallback')).toBeInTheDocument();
    });

    it('should render component with type bar and data undefined.', () => {
        renderComponent({ top: 5, data: undefined, subtitle: 'subtitle' });
        expect(screen.getByTestId('mock-chart-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-title')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-fallback')).toBeInTheDocument();
    });

    it('should render component with type bar.', () => {
        renderComponent({ data: mockBarData, subtitle: 'subtitle'});
        expect(screen.getByTestId('mock-chart-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-title')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-subtitle')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    });

    it('should render component with type bar with chartTooltip.', () => {
        renderComponent({ data: mockBarData, subtitle: 'subtitle', chartTooltip: {countText: 'expenses', valueText: 'Total'} });
        expect(screen.getByTestId('mock-chart-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-title')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-subtitle')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    });

    it('should render component with type pie.', () => {
        renderComponent({ type: 'pie', data: mockPieData, subtitle: 'subtitle' });
        expect(screen.getByTestId('mock-chart-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-title')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-subtitle')).toBeInTheDocument();
        expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
    });

    it('should render component with type pie with chartTooltip.', () => {
        renderComponent({ type: 'pie', data: mockPieData, subtitle: 'subtitle', chartTooltip: {countText: 'expenses', valueText: 'Total'} });
        expect(screen.getByTestId('mock-chart-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-title')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-subtitle')).toBeInTheDocument();
        expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
    });


});