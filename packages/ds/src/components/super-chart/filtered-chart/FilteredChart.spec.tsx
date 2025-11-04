import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';
import FilteredChart from './FilteredChart';

jest.mock('recharts', () => ({
    DefaultLegendContent: (props: any) => (<div {...props}/>),
    DefaultTooltipContent: (props: any) => (<div {...props}/>),
}));

describe('<FilteredChart/>', () => {
    const defaultProps = {};

    const mockFilteredLegend = {
        show: true,
        filterContent: {
            label: 'dataKey',
            value: 'a',
            condition: '!=='
        },
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


    };

    const mockFilteredTooltip = {
        axisId: 0,
        cursor: true,
        offset: 10,
        active: false,
        trigger: 'hover',
        payload: [
            { dataKey: 'a' },
            { dataKey: 'b' },
        ],
        itemStyle: {},
        labelStyle: {},
        separator: ' : ',
        filterNull: true,
        itemSorter: 'name',
        contentStyle: {},
        wrapperStyle: {},
        filterContent: {
            label: 'dataKey',
            value: 'a',
            condition: '!=='
        },
        useTranslate3d: false,
        animationEasing: 'ease',
        reverseDirection: {
            x: false,
            y: false
        },
        animationDuration: 400,
        isAnimationActive: true,
        allowEscapeViewBox: {
            x: false,
            y: false
        },
        accessibilityLayer: true
    }

    const renderComponent = (props: any = {}) => {
        return render(<FilteredChart {...defaultProps} {...props}/>)
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('render component with null when dont received filteredLegend and filteredTooltip', () => {
        renderComponent();
        expect(screen.queryByTestId('ds-filtered-chart-legend')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ds-filtered-chart-tooltip')).not.toBeInTheDocument();
    });

    it('should render component with filteredLegend  and filteredTooltip.', () => {
        renderComponent({ filteredLegend: mockFilteredLegend, filteredTooltip: mockFilteredTooltip });
        expect(screen.getByTestId('ds-filtered-chart-legend')).toBeInTheDocument();
        expect(screen.getByTestId('ds-filtered-chart-tooltip')).toBeInTheDocument();
    });

    it('should render component without filterContent param.', () => {
        renderComponent({
            filteredTooltip: {
                ...mockFilteredTooltip,
                filterContent: {
                    ...mockFilteredTooltip.filterContent,
                    label: 'other'
                }
            }
        });
        expect(screen.queryByTestId('ds-filtered-chart-legend')).not.toBeInTheDocument();
        expect(screen.getByTestId('ds-filtered-chart-tooltip')).toBeInTheDocument();
    });

    it('should render component without filterContent value.', () => {
        renderComponent({
            filteredTooltip: {
                ...mockFilteredTooltip,
                filterContent: {
                    ...mockFilteredTooltip.filterContent,
                    value: undefined
                }
            }
        });
        expect(screen.queryByTestId('ds-filtered-chart-legend')).not.toBeInTheDocument();
        expect(screen.getByTestId('ds-filtered-chart-tooltip')).toBeInTheDocument();
    });

    it('should render component without filterContent condition.', () => {
        renderComponent({
            filteredTooltip: {
                ...mockFilteredTooltip,
                filterContent: {
                    ...mockFilteredTooltip.filterContent,
                    condition: undefined
                }
            }
        });
        expect(screen.queryByTestId('ds-filtered-chart-legend')).not.toBeInTheDocument();
        expect(screen.getByTestId('ds-filtered-chart-tooltip')).toBeInTheDocument();
    });

    it('should render component with filterContent condition ===.', () => {
        renderComponent({
            filteredTooltip: {
                ...mockFilteredTooltip,
                filterContent: {
                    ...mockFilteredTooltip.filterContent,
                    condition: '==='
                }
            }
        });
        expect(screen.queryByTestId('ds-filtered-chart-legend')).not.toBeInTheDocument();
        expect(screen.getByTestId('ds-filtered-chart-tooltip')).toBeInTheDocument();
    });

    it('should render component with filterContent condition >.', () => {
        renderComponent({
            filteredTooltip: {
                ...mockFilteredTooltip,
                filterContent: {
                    ...mockFilteredTooltip.filterContent,
                    condition: '>'
                }
            }
        });
        expect(screen.queryByTestId('ds-filtered-chart-legend')).not.toBeInTheDocument();
        expect(screen.getByTestId('ds-filtered-chart-tooltip')).toBeInTheDocument();
    });

    it('should render component with filterContent condition <.', () => {
        renderComponent({
            filteredTooltip: {
                ...mockFilteredTooltip,
                filterContent: {
                    ...mockFilteredTooltip.filterContent,
                    condition: '<'
                }
            }
        });
        expect(screen.queryByTestId('ds-filtered-chart-legend')).not.toBeInTheDocument();
        expect(screen.getByTestId('ds-filtered-chart-tooltip')).toBeInTheDocument();
    });

    it('should render component with filterContent condition >=.', () => {
        renderComponent({
            filteredTooltip: {
                ...mockFilteredTooltip,
                filterContent: {
                    ...mockFilteredTooltip.filterContent,
                    condition: '>='
                }
            }
        });
        expect(screen.queryByTestId('ds-filtered-chart-legend')).not.toBeInTheDocument();
        expect(screen.getByTestId('ds-filtered-chart-tooltip')).toBeInTheDocument();
    });

    it('should render component with filterContent condition <=.', () => {
        renderComponent({
            filteredTooltip: {
                ...mockFilteredTooltip,
                filterContent: {
                    ...mockFilteredTooltip.filterContent,
                    condition: '<='
                }
            }
        });
        expect(screen.queryByTestId('ds-filtered-chart-legend')).not.toBeInTheDocument();
        expect(screen.getByTestId('ds-filtered-chart-tooltip')).toBeInTheDocument();
    });

    it('should render component with filterContent condition unknown.', () => {
        renderComponent({
            filteredTooltip: {
                ...mockFilteredTooltip,
                filterContent: {
                    ...mockFilteredTooltip.filterContent,
                    condition: 'unknown'
                }
            }
        });
        expect(screen.queryByTestId('ds-filtered-chart-legend')).not.toBeInTheDocument();
        expect(screen.getByTestId('ds-filtered-chart-tooltip')).toBeInTheDocument();
    });

    describe('filteredLegend', () => {
        it('should render component with filteredLegend.', () => {
            renderComponent({ filteredLegend: mockFilteredLegend });
            expect(screen.getByTestId('ds-filtered-chart-legend')).toBeInTheDocument();
            expect(screen.queryByTestId('ds-filtered-chart-tooltip')).not.toBeInTheDocument();
        });

        it('should render component with filteredLegend and without filterContent.', () => {
            renderComponent({ filteredLegend: {...mockFilteredLegend, filterContent: undefined} });
            expect(screen.getByTestId('ds-filtered-chart-legend')).toBeInTheDocument();
            expect(screen.queryByTestId('ds-filtered-chart-tooltip')).not.toBeInTheDocument();
        });
    });

    describe('filteredTooltip', () => {
        it('should render component with filteredTooltip.', () => {
            renderComponent({ filteredTooltip: mockFilteredTooltip });
            expect(screen.queryByTestId('ds-filtered-chart-legend')).not.toBeInTheDocument();
            expect(screen.getByTestId('ds-filtered-chart-tooltip')).toBeInTheDocument();
        });

        it('should render component with filteredTooltip and without filterContent.', () => {
            renderComponent({ filteredTooltip: {...mockFilteredTooltip, filterContent: undefined} });
            expect(screen.queryByTestId('ds-filtered-chart-legend')).not.toBeInTheDocument();
            expect(screen.getByTestId('ds-filtered-chart-tooltip')).toBeInTheDocument();
        });
    });

});