import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

import CustomizedDot from './CustomizedDot';
import { CustomizeDotSvgParams } from '../types';

describe('<CustomizedDot/>', () => {
    const defaultProps = {
        value: 2400
    }

    const renderComponent = (props = {}) => {
        return render(<CustomizedDot {...defaultProps } {...props} />);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('ds-line-chart-customized-dot-null')).toBeInTheDocument();
        expect(screen.queryByTestId('ds-line-chart-customized-dot-default')).not.toBeInTheDocument();
    });

    it('should render component with cy undefined.', () => {
        renderComponent({ cx: 60 });
        expect(screen.getByTestId('ds-line-chart-customized-dot-null')).toBeInTheDocument();
        expect(screen.queryByTestId('ds-line-chart-customized-dot-default')).not.toBeInTheDocument();
    });

    it('should render component with default svg.', () => {
        renderComponent({ cx: 60, cy: 303.68 });
        expect(screen.queryByTestId('ds-line-chart-customized-dot-null')).not.toBeInTheDocument();
        const defaultSvgComponent = screen.getByTestId('ds-line-chart-customized-dot-default-min')
        expect(defaultSvgComponent).toBeInTheDocument();
        expect(defaultSvgComponent).toHaveAttribute('fill', 'green');
    });

    it('should render component with default svg and value greater then max value.', () => {
        renderComponent({ cx: 60, cy: 303.68, type: 'max', customDot: { maxValue: 2000 } });
        expect(screen.queryByTestId('ds-line-chart-customized-dot-null')).not.toBeInTheDocument();
        const defaultSvgComponent = screen.getByTestId('ds-line-chart-customized-dot-default-max')
        expect(defaultSvgComponent).toBeInTheDocument();
        expect(defaultSvgComponent).toHaveAttribute('fill', 'red');
    });

    it('should render component with custom dot svg.', () => {
        renderComponent({
            cx: 60,
            cy: 303.68,
            customDot: {
                svg: ({x, y, width, height, fill}: CustomizeDotSvgParams) => {
                    return (
                        <svg x={x} y={y} width={width} height={height} fill={fill} viewBox="0 0 1024 1024" data-testid="ds-line-chart-customized-dot-custom">
                            <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
                        </svg>
                    )
                },
                width: 100,
                height: 100,
                fillMin: '#000',
                fillMax: '#FFF',
                maxValue: 2000
            }
        });
        expect(screen.queryByTestId('ds-line-chart-customized-dot-null')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ds-line-chart-customized-dot-default')).not.toBeInTheDocument();
        const customSvgComponent = screen.getByTestId('ds-line-chart-customized-dot-custom')
        expect(customSvgComponent).toBeInTheDocument();
        expect(customSvgComponent).toHaveAttribute('fill', '#FFF');
    });
});