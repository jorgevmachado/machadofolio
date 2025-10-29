import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

import LinearGradient from './LinearGradient';

describe('<LinearGradient/>', () => {
    const areas = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: -1000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 500,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: -2000,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: -250,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];
    const defaultProps = {
        id: 'gradient1',
        areas,
        value: 'uv',
        stops: [
            {
                key: 'stop-green',
                offset: '0',
                stopColor: 'green',
                stopOpacity: 1,
            },
            {
                key: 'stop-green-custom',
                stopColor: 'green',
                stopOpacity: 0.1
            },
            {
                key: 'stop-red-custom',
                stopColor: 'red',
                stopOpacity: 0.1
            },
            {
                key: 'stop-red',
                offset: '1',
                stopColor: 'red',
                stopOpacity: 1
            }
        ],
    }

    const renderComponent = (props = {}) => {
        return render(<LinearGradient {...defaultProps } {...props} />);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const linearGradient = screen.getByTestId('ds-area-chart-linear-gradient');
        expect(linearGradient).toBeInTheDocument();
        expect(linearGradient).toHaveAttribute('id', 'gradient1');
        expect(linearGradient).toHaveAttribute('x1', '0');
        expect(linearGradient).toHaveAttribute('x2', '0');
        expect(linearGradient).toHaveAttribute('y1', '0');
        expect(linearGradient).toHaveAttribute('y2', '0');
    });

    it('should render component with positive areas', () => {
        const mockPositiveAreas = areas.map((item) => item.uv <= 0 ? { ...item, uv: 2000 } : item);
        renderComponent({ areas: mockPositiveAreas });
        expect(screen.getByTestId('ds-area-chart-linear-gradient')).toBeInTheDocument();
        const stop1 = screen.getByTestId('ds-area-chart-linear-gradient-stop-stop-green');
        expect(stop1).toBeInTheDocument();
        expect(stop1).toHaveAttribute('offset', '0');

        const stop2 = screen.getByTestId('ds-area-chart-linear-gradient-stop-stop-green-custom');
        expect(stop2).toBeInTheDocument();
        expect(stop2).toHaveAttribute('offset', '1');
    });

    it('should render component with negative areas', () => {
        const mockNegativeAreas = areas.map((item) => ({ ...item, uv: -2000 }));
        renderComponent({ areas: mockNegativeAreas });
        expect(screen.getByTestId('ds-area-chart-linear-gradient')).toBeInTheDocument();
        const stop1 = screen.getByTestId('ds-area-chart-linear-gradient-stop-stop-green');
        expect(stop1).toBeInTheDocument();
        expect(stop1).toHaveAttribute('offset', '0');

        const stop2 = screen.getByTestId('ds-area-chart-linear-gradient-stop-stop-green-custom');
        expect(stop2).toBeInTheDocument();
        expect(stop2).toHaveAttribute('offset', '0');
    });

    it('should render component with value not exist', () => {
        renderComponent({ value: 'xt' });
        expect(screen.getByTestId('ds-area-chart-linear-gradient')).toBeInTheDocument();
        const stop1 = screen.getByTestId('ds-area-chart-linear-gradient-stop-stop-green');
        expect(stop1).toBeInTheDocument();
        expect(stop1).toHaveAttribute('offset', '0');

        const stop2 = screen.getByTestId('ds-area-chart-linear-gradient-stop-stop-green-custom');
        expect(stop2).toBeInTheDocument();
        expect(stop2).toHaveAttribute('offset', '0');
    });

    it('should render component with stops value strings', () => {
        const mockAreasString = areas.map((item) => ({ ...item, uv: String(item.uv) }));
        renderComponent({ areas: mockAreasString });
        expect(screen.getByTestId('ds-area-chart-linear-gradient')).toBeInTheDocument();
        const stop1 = screen.getByTestId('ds-area-chart-linear-gradient-stop-stop-green');
        expect(stop1).toBeInTheDocument();
        expect(stop1).toHaveAttribute('offset', '0');

        const stop2 = screen.getByTestId('ds-area-chart-linear-gradient-stop-stop-green-custom');
        expect(stop2).toBeInTheDocument();
        expect(stop2).toHaveAttribute('offset', '0.6666666666666666');
    });

    it('should render component with stops value isNan', () => {
        const mockAreasString = areas.map((item) => ({ ...item, uv: 'IsNan' }));
        renderComponent({ areas: mockAreasString });
        expect(screen.getByTestId('ds-area-chart-linear-gradient')).toBeInTheDocument();
        const stop1 = screen.getByTestId('ds-area-chart-linear-gradient-stop-stop-green');
        expect(stop1).toBeInTheDocument();
        expect(stop1).toHaveAttribute('offset', '0');

        const stop2 = screen.getByTestId('ds-area-chart-linear-gradient-stop-stop-green-custom');
        expect(stop2).toBeInTheDocument();
        expect(stop2).toHaveAttribute('offset', '0');
    });

});