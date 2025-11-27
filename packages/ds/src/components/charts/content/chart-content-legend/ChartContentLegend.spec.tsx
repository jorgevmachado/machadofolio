import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('recharts', () => ({
    DefaultLegendContent: (props: any) => (<div {...props}/>),
}));

jest.mock('../filters', () => ({
    compareFilter: ({ param, value }: any) => param !== value,
}));

import ChartContentLegend from './ChartContentLegend';

describe('<ChartContentLegend />', () => {

    const defaultProps = {
        legend: {
            filterContent: [{
                label: 'dataKey',
                value: 'a',
                condition: '!=='
            }]
        },
        params: {
            align: 'center',
            width: 700,
            margin: {
                top: 20,
                left: 0,
                right: 0,
                bottom: 0,

            },
            layout: 'horizontal',
            payload: [
                {
                    type: 'line',
                    color: '#cccccc',
                    value: 'a',
                    dataKey: 'a',
                    inactive: false,
                    payload: {
                        hide: false,
                        type: 'monotone',
                        fill: '#cccccc',
                        stroke: 'none',
                        dataKey: 'a',
                        xAxisId: 0,
                        yAxisId: 0,
                        payload: false,
                        activeDot: false,
                        legendType: 'line',
                        fillOpacity: 0.6,
                        connectNulls: true,
                        animationBegin: 0,
                        animationEasing: 'ease',
                        animationDuration: 1500,
                        isAnimationActive: true,
                    }
                },
                {
                    type: 'line',
                    color: '#ff00ff',
                    value: 'b',
                    dataKey: 'b',
                    inactive: false,
                    payload: {
                        fill: '#fff',
                        hide: false,
                        type: 'natural',
                        label: false,
                        stroke: '#ff00ff',
                        dataKey: 'b',
                        xAxisId: 0,
                        yAxisId: 0,
                        payload: true,
                        activeDot: true,
                        legendType: 'line',
                        strokeWidth: 1,
                        connectNulls: true,
                        animationBegin: 0,
                        animationEasing: 'ease',
                        animateNewValues: true,
                        animationDuration: 1500,
                        isAnimationActive: true,
                    }
                }
            ],
            iconSize: 14,
            itemSorter: 'value',
            chartWidth: 700,
            chartHeight: 433,
            verticalAlign: 'bottom',
        }
    };

    const renderComponent = (props: any = {}) => {
        return render(<ChartContentLegend {...defaultProps} {...props}/>)
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('ds-chart-content-legend')).toBeInTheDocument();
    });

    it('should render component without payload.', () => {
        renderComponent({ params: { ...defaultProps.params, payload: undefined }});
        expect(screen.getByTestId('ds-chart-content-legend')).toBeInTheDocument();
    });

    it('should render component without filterContent.', () => {
        renderComponent({ legend: { ...defaultProps.legend, filterContent: undefined }});
        expect(screen.getByTestId('ds-chart-content-legend')).toBeInTheDocument();
    });

});