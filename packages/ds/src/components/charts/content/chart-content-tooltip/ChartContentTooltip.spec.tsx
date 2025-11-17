import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('recharts', () => ({
    DefaultTooltipContent: (props: any) => (<div {...props}/>)
}));

jest.mock('@repo/services', () => ({
    convertToNumber: (value: unknown) => Number(value)
}));

jest.mock('../utils', () => ({
    compareFilter: ({ param, value }: any) => param !== value,
}));

jest.mock('./text-tooltip', () => ({
    __esModule: true,
    default: ({ type, dataName, appendText, ...props}: any) => (<p {...props} data-testid={`ds-chart-content-tooltip-${type}`}>
        {dataName} {appendText}
    </p>),
    TextTooltip: ({ type, dataName, appendText, ...props}: any) => (<p {...props} data-testid={`ds-chart-content-tooltip-${type}`}>
        {dataName} {appendText}
    </p>),
}));

jest.mock('./generic-content-tooltip', () => ({
    __esModule: true,
    default: (props: any) => (<p {...props} data-testid="mock-generic-content-tooltip">generic: 500</p>),
    GenericContentTooltip: (props: any) => (<p {...props} data-testid="mock-generic-content-tooltip">generic: 500</p>),
}));

import ChartContentTooltip from './ChartContentTooltip';

describe('<ChartContentTooltip/>', () => {

    const mockPayloadItemSubLevel =  {
        name: 'sub-level',
        value: 2000,
    }

    const mockPayloadItemA = {
        value: 3000,
        dataKey: 'a',
        payload: {
            name: 'test',
            hour: 'hour',
            count: '500',
            value: 3000,
            generic: 500,
            payload: mockPayloadItemSubLevel,
            percentageTotal: '50',
        }
    }

    const mockPayloadItemB = {
        value: 4000,
        dataKey: 'b',
        payload: {
            name: 'test-b',
            hour: 'hour-b',
            count: '600',
            value: 4000,
            generic: 600,
            payload: undefined,
        }
    }

    const mockParams = {
        active: true,
        label: 'Label',
        payload: [mockPayloadItemA, mockPayloadItemB]
    }

    const defaultProps = {
        params: {},
        tooltip: {}
    }

    const renderComponent = (props: any = {}) => {
        return render(<ChartContentTooltip {...defaultProps} {...props} />);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.queryByTestId('ds-chart-content-tooltip')).not.toBeInTheDocument();
    });

    it('should render component with params active equal true and payload undefined.', () => {
        renderComponent({ params: { active: true } });
        expect(screen.queryByTestId('ds-chart-content-tooltip')).not.toBeInTheDocument();
    });

    it('should render component with params active equal true and payload empty.', () => {
        renderComponent({ params: { active: true, payload: [] } });
        expect(screen.queryByTestId('ds-chart-content-tooltip')).not.toBeInTheDocument();
    });

    it('should render component with params complete and tooltip withDefaultTooltip.', () => {
        renderComponent({ params: mockParams, tooltip: { withDefaultTooltip: true } });
        expect(screen.getByTestId('ds-chart-content-tooltip-default')).toBeInTheDocument();
        expect(screen.queryByTestId('ds-chart-content-tooltip')).not.toBeInTheDocument();
    });

    it('should render component with custom label.', () => {
        renderComponent({ params: mockParams, tooltip: { labelProps: { show: true} } });
        expect(screen.queryByTestId('ds-chart-content-tooltip-default')).not.toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-content-tooltip')).toBeInTheDocument();
        const text = screen.getByTestId(`ds-chart-content-tooltip-label`);
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('Label');
    });

    it('should render component with custom name.', () => {
        renderComponent({ params: mockParams, tooltip: {} });
        const text = screen.getByTestId(`ds-chart-content-tooltip-name`);
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('test');
    });

    it('should render component with custom name with flag show equal true.', () => {
        renderComponent({ params: mockParams, tooltip: { nameProps: { show: true }} });
        const text = screen.getByTestId(`ds-chart-content-tooltip-name`);
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('test');
    });

    it('should render component with custom hour.', () => {
        renderComponent({ params: mockParams, tooltip: {} });
        const text = screen.getByTestId(`ds-chart-content-tooltip-hour`);
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('hour');
    });

    it('should render component with custom hour with flag show equal true.', () => {
        renderComponent({ params: mockParams, tooltip: { hourProps: { show: true }} });
        const text = screen.getByTestId(`ds-chart-content-tooltip-hour`);
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('hour');
    });

    it('should render component with custom value.', () => {
        renderComponent({ params: mockParams, tooltip: {} });
        const text = screen.getByTestId(`ds-chart-content-tooltip-value`);
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('3000');
    });

    it('should render component with custom value with flag show equal true.', () => {
        renderComponent({ params: mockParams, tooltip: { valueProps: { show: true }} });
        const text = screen.getByTestId(`ds-chart-content-tooltip-value`);
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('3000');
    });

    it('should render component with custom count.', () => {
        renderComponent({ params: mockParams, tooltip: {} });
        const text = screen.getByTestId(`ds-chart-content-tooltip-count`);
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('500');
    });

    it('should render component with custom count with flag show equal true.', () => {
        renderComponent({ params: mockParams, tooltip: { countProps: { show: true }} });
        const text = screen.getByTestId(`ds-chart-content-tooltip-count`);
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('500');
    });

    it('should render component with custom percentage.', () => {
        renderComponent({ params: mockParams, tooltip: {} });
        const text = screen.getByTestId(`ds-chart-content-tooltip-percentage`);
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('6000.0%');
    });

    it('should render component with custom percentage with flag show equal true.', () => {
        renderComponent({ params: mockParams, tooltip: { percentageProps: { show: true }, withTotalPercent: true } });
        const text = screen.getByTestId(`ds-chart-content-tooltip-percentage`);
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('6000.0%');
    });

    it('should render component with custom label with totalPercent.', () => {
        renderComponent({
            params: mockParams,
            tooltip: {
                labelProps: { show: true },
                withTotalPercent: true
            }
        });
        const text = screen.getByTestId(`ds-chart-content-tooltip-label`);
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('Label (Total: 7000)');
    });

    it('should render component with custom percentage with flag show equal true and no percentageTotal.', () => {
        renderComponent({
            params: {
                ...mockParams,
                payload: mockParams.payload.map((item) => ({
                    ...item,
                    payload: {
                        ...item.payload,
                        percentageTotal: undefined
                    }
                }))
            },
            tooltip: {
                percentageProps: { show: true }
            }
        });
        expect(screen.queryByTestId(`ds-chart-content-tooltip-percentage`)).not.toBeInTheDocument();
    });

    it('should render component with custom generic with flag show equal true.', () => {
        renderComponent({ params: mockParams, tooltip: { genericTextProps: { show: true }} });
        const text = screen.getByTestId(`mock-generic-content-tooltip`);
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('generic: 500');
    });

    it('should render component with custom filter content', () => {
        renderComponent({
            params: mockParams,
            tooltip: {
                filterContent: [{
                    label: 'dataKey',
                    value: 'a',
                    condition: '!=='
                }]
            }
        });

        const nameText = screen.getByTestId(`ds-chart-content-tooltip-name`);
        expect(nameText).toBeInTheDocument();
        expect(nameText).toHaveTextContent('test-b');

        const textHour = screen.getByTestId(`ds-chart-content-tooltip-hour`);
        expect(textHour).toBeInTheDocument();
        expect(textHour).toHaveTextContent('hour-b');

        const textValue = screen.getByTestId(`ds-chart-content-tooltip-value`);
        expect(textValue).toBeInTheDocument();
        expect(textValue).toHaveTextContent('4000');

        const textCount = screen.getByTestId(`ds-chart-content-tooltip-count`);
        expect(textCount).toBeInTheDocument();
        expect(textCount).toHaveTextContent('600');
        
        expect(screen.queryByTestId(`ds-chart-content-tooltip-percentage`)).not.toBeInTheDocument();
    });

    it('should render component with tooltip withSubLevel equal true.', () => {
        renderComponent({ params: mockParams, tooltip: { withSubLevel: true } });

        const nameText = screen.getByTestId(`ds-chart-content-tooltip-name`);
        expect(nameText).toBeInTheDocument();
        expect(nameText).toHaveTextContent('sub-level');

        const textValue = screen.getByTestId(`ds-chart-content-tooltip-value`);
        expect(textValue).toBeInTheDocument();
        expect(textValue).toHaveTextContent('2000');

        expect(screen.queryByTestId(`ds-chart-content-tooltip-hour`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`ds-chart-content-tooltip-count`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`ds-chart-content-tooltip-percentage`)).not.toBeInTheDocument();
    });

    it('should render component with tooltip withSubLevel equal true.', () => {
        renderComponent({
            params: mockParams,
            tooltip: {
                withSubLevel: true,
                filterContent: [{
                    label: 'dataKey',
                    value: 'a',
                    condition: '!=='
                }]
            }
        });

        expect(screen.queryByTestId(`ds-chart-content-tooltip-name`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`ds-chart-content-tooltip-value`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`ds-chart-content-tooltip-hour`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`ds-chart-content-tooltip-count`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`ds-chart-content-tooltip-percentage`)).not.toBeInTheDocument();
    });
});