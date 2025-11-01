import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';
import ChartTooltip from './ChartTooltip';

jest.mock('@repo/services', () => ({
    currencyFormatter: jest.fn((value) => `R$${value}`)
}));

jest.mock('../../../elements', () => ({
    Text: (props: any) => (<p {...props}/>),
}));

describe('<ChartTooltip/>', () => {
    const defaultProps = {};

    const mockPayload = {
            type: 'bank',
            hour: '12A',
            name: 'Nubank',
            value: 400,
            count: 4,
            percentageTotal: 80,
    };

    const renderComponent = (props: any = {}) => {
        return render(<ChartTooltip {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.queryByTestId('ds-chart-tooltip')).not.toBeInTheDocument();
    });

    it('should render component with active tooltip and payload.', () => {
        renderComponent({ active: true, payload: [{ payload: mockPayload } ]});
        expect(screen.getByTestId('ds-chart-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-tooltip-name')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-tooltip-value')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-tooltip-count')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-tooltip-percentage')).toBeInTheDocument();
    });

    it('should render component with active tooltip and payload with all props.', () => {
        renderComponent({
            active: true,
            payload: [{ payload: mockPayload } ],
            nameProps: { show: true },
            hourProps: { show: true },
            valueProps: { show: true },
            countProps: { show: true },
            percentageProps: { show: true },
            withGenericProps: true,
            genericTextProps: {
                show: true,
                text: 'Generic text',
                style: { color: 'red' },
            },
        });
        expect(screen.getByTestId('ds-chart-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId("ds-chart-tooltip-name")).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-tooltip-value')).toBeInTheDocument();
        const countElements = screen.getAllByTestId('ds-chart-tooltip-count');
        expect(countElements).toHaveLength(1);
        expect(countElements[0]).toHaveTextContent('Count: 4');
        const countGenericElements = screen.getAllByTestId('ds-chart-tooltip-count-generic');
        expect(countGenericElements).toHaveLength(1);
        expect(countGenericElements[0]).toHaveTextContent('count: 4');
        expect(screen.getByTestId('ds-chart-tooltip-hour')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-tooltip-percentage')).toBeInTheDocument();
    });

    it('should render component with with payload in payload undefined.', () => {
        renderComponent({ active: true, payload: [{ payload: undefined } ]});
        expect(screen.getByTestId('ds-chart-tooltip')).toBeInTheDocument();
        expect(screen.queryByTestId('ds-chart-tooltip-name')).not.toBeInTheDocument();
    });
})