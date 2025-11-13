import React from 'react';

jest.mock('@repo/services', () => {
    return {
        convertToPercent: jest.fn((value: number) => value * 100),
        currencyFormatter: jest.fn((value: number) => value.toFixed(2)),
    }
})

jest.mock('./content', () => ({
  ChartContentTooltip: jest.fn((props = {}) => React.createElement('div', { 'data-testid': 'mock-tooltip', ...props })),
  ChartContentLegend: jest.fn((props = {}) => React.createElement('div', { 'data-testid': 'mock-legend', ...props })),
}));

import { buildTooltip, buildLegend, buildAxis } from './utils';
import type { TooltipProps, LegendProps } from './types';
import { currencyFormatter, convertToPercent } from '@repo/services';

describe('buildTooltip', () => {
  it('returns undefined if tooltip.show is false', () => {
    const tooltip: TooltipProps = { show: false } as TooltipProps;
    expect(buildTooltip(tooltip)).toBeUndefined();
  });

  it('returns the tooltip if content is already set', () => {
    const contentFn = jest.fn();
    const tooltip: TooltipProps = { content: contentFn } as TooltipProps;
    expect(buildTooltip(tooltip)?.content).toBe(contentFn);
  });

  it('returns tooltip with content as undefined if withContent is false', () => {
    const tooltip: TooltipProps = { withContent: false } as TooltipProps;
    expect(buildTooltip(tooltip)?.content).toBeUndefined();
  });

  it('returns tooltip with content as ChartContentTooltip if withContent is not false', () => {
    const tooltip: TooltipProps = {} as TooltipProps;
    const result = buildTooltip(tooltip);
    expect(result?.content).toBeDefined();
    const props = { foo: 'bar' } as any;
    if (typeof result?.content === 'function') {
      const element = result.content(props);
      if (element) {
        expect(element).toHaveProperty('props');
        expect(element).toHaveProperty('type');
      }
    } else {
      if (result?.content) {
        expect(result?.content).toHaveProperty('props');
        expect(result?.content).toHaveProperty('type');
      }
    }
  });

  it('calls ChartContentTooltip with correct params when content is used', () => {
    const tooltip: TooltipProps = {} as TooltipProps;
    const result = buildTooltip(tooltip);
    const mock = require('./content').ChartContentTooltip;
    const props = { foo: 'bar' } as any;
    if (typeof result?.content === 'function') {
      result.content(props);
      expect(mock).toHaveBeenCalledWith({ params: props, tooltip: result });
    }
  });

  it('returns tooltip without content when withDefaultTooltip is true', () => {
    const tooltip: TooltipProps = { withDefaultTooltip: true } as TooltipProps;
    const result = buildTooltip(tooltip);
    expect(result).toBeDefined();
    expect(result?.withDefaultTooltip).toBe(true);
    expect(result?.content).toBeUndefined();
  });
});

describe('buildLegend', () => {
  it('returns undefined if legend.show is false', () => {
    const legend: LegendProps = { show: false } as LegendProps;
    expect(buildLegend(legend)).toBeUndefined();
  });

  it('returns the legend if content is already set', () => {
    const contentFn = jest.fn();
    const legend: LegendProps = { content: contentFn } as LegendProps;
    expect(buildLegend(legend)?.content).toBe(contentFn);
  });

  it('returns legend with content as undefined if withContent is false', () => {
    const legend: LegendProps = { withContent: false } as LegendProps;
    expect(buildLegend(legend)?.content).toBeUndefined();
  });

  it('returns legend with content as ChartContentLegend if withContent is not false', () => {
    const legend: LegendProps = {} as LegendProps;
    const result = buildLegend(legend);
    expect(result?.content).toBeDefined();
    const props = { foo: 'bar' } as any;
    if (typeof result?.content === 'function') {
      const element = result.content(props);
      if (element) {
        expect(element).toHaveProperty('props');
        expect(element).toHaveProperty('type');
      }
    } else {
      if (result?.content) {
        expect(result?.content).toHaveProperty('props');
        expect(result?.content).toHaveProperty('type');
      }
    }
  });

  it('calls ChartContentLegend with correct params when content is used', () => {
    const legend: LegendProps = {} as LegendProps;
    const result = buildLegend(legend);
    const mock = require('./content').ChartContentLegend;
    const props = { foo: 'bar' } as any;
    if (typeof result?.content === 'function') {
      result.content(props);
      expect(mock).toHaveBeenCalledWith({ params: props, legend: result });
    }
  });

    it('returns legend without content when withDefaultLegend is true', () => {
        const legend: LegendProps = { withDefaultLegend: true } as LegendProps;
        const result = buildLegend(legend);
        expect(result).toBeDefined();
        expect(result?.withDefaultLegend).toBe(true);
        expect(result?.content).toBeUndefined();
    });
});

describe('buildAxis', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it( 'should return default props', () => {
        const result = buildAxis({ type: 'bar', layout: 'vertical'});
        expect(result.xList).toEqual([{ key: 'x-axis-0', dataKey: 'name' }]);
        expect(result.yList).toEqual([{ key: 'y-axis-0', width: 'auto' }]);
        expect(result.zList).toEqual([{ key: 'z-axis-0', type: 'number', range: [100, 100] }]);
    });

    it('should return props with layout horizontal', () => {
        const result = buildAxis({ type: 'bar', layout: 'horizontal'});
        expect(result.xList).toEqual([{ key: 'x-axis-0', type: 'number' }]);
        expect(result.yList).toEqual([{ key: 'y-axis-0', type: 'category', width: 90, dataKey: 'name' }]);
        expect(result.zList).toEqual([{ key: 'z-axis-0', type: 'number', range: [100, 100] }]);
    });

    it('should return props with type scatter', () => {
        const result = buildAxis({ type: 'scatter', layout: 'horizontal'});
        expect(result.xList).toEqual([{ key: 'x-axis-0', unit: 'cm', type: 'number', name: 'stature', dataKey: 'x' }]);
        expect(result.yList).toEqual([{ key: 'y-axis-0', unit: 'kg', type: 'number', name: 'weight',  dataKey: 'y', width: 'auto' }]);
        expect(result.zList).toEqual([{ key: 'z-axis-0', type: 'number', range: [100, 100] }]);
    });

    it( 'should return default props with type line', () => {
        const result = buildAxis({ type: 'line', layout: 'vertical'});
        expect(result.xList).toEqual([{ key: 'x-axis-0', dataKey: 'name'}]);
        expect(result.yList).toEqual([{ key: 'y-axis-0', width: 'auto'}]);
        expect(result.zList).toEqual([{ key: 'z-axis-0', type: 'number', range: [100, 100] }]);
    });

    it( 'should return default props withPercentFormatter equal true', () => {
        const result = buildAxis({ type: 'bar', layout: 'vertical', withPercentFormatter: true });
        expect(result.xList).toEqual([{ key: 'x-axis-0', dataKey: 'name' }]);
        result.yList?.forEach((item) => {
            expect(item.key).toBe('y-axis-0');
            expect(item.width).toBe('auto');
            expect(item.tickFormatter).toBeDefined();
            expect(typeof item.tickFormatter).toBe('function');
        });

        expect(result.zList).toEqual([{ key: 'z-axis-0', type: 'number', range: [100, 100] }]);
    });

    it( 'should return default props withAxisCurrencyTickFormatter equal true', () => {
        const result = buildAxis({ type: 'bar', layout: 'vertical', withAxisCurrencyTickFormatter: true });

        result.xList?.forEach((item) => {
            expect(item.key).toBe('x-axis-0');
            expect(item.dataKey).toBe('name');
            expect(item.tickFormatter).toBeUndefined();
        });

        result.yList?.forEach((item) => {
            expect(item.key).toBe('y-axis-0');
            expect(item.width).toBe('auto');
            expect(item.tickFormatter).toBeDefined();
            expect(typeof item.tickFormatter).toBe('function');
        })

        expect(result.zList).toEqual([{ key: 'z-axis-0', type: 'number', range: [100, 100] }]);
    });

    it( 'should return default props withAxisCurrencyTickFormatter equal true and layout horizontal', () => {
        const result = buildAxis({ type: 'bar', layout: 'horizontal', withAxisCurrencyTickFormatter: true },);
        result.xList?.forEach((item) => {
            expect(item.key).toBe('x-axis-0');
            expect(item.type).toBe('number');
            expect(item.tickFormatter).toBeDefined();
            expect(typeof item.tickFormatter).toBe('function');
        });

        result.yList?.forEach((item) => {
            expect(item.key).toBe('y-axis-0');
            expect(item.type).toBe('category');
            expect(item.width).toBe(90);
            expect(item.dataKey).toBe('name');
            expect(item.tickFormatter).toBeUndefined();
        });
        expect(result.zList).toEqual([{ key: 'z-axis-0', type: 'number', range: [100, 100] }]);
    });

    it('should return custom props when received xAxis, yAxis and zAxis', () => {
        const mockXAxis = [{ key: 'x-axis-custom', dataKey: 'name' }];
        const mockYAxis = [{ key: 'y-axis-custom', dataKey: 'name' }];
        const mockZAxis = [{ key: 'z-axis-custom', dataKey: 'name' }];
        const result = buildAxis({
            type: 'bar',
            layout: 'horizontal',
            xAxis: mockXAxis,
            yAxis: mockYAxis,
            zAxis: mockZAxis,
        });
        expect(result.xList).toEqual(mockXAxis);
        expect(result.yList).toEqual(mockYAxis);
        expect(result.zList).toEqual(mockZAxis);
    });

    it('should call currencyFormatter in xList tickFormatter when withAxisCurrencyTickFormatter is true and layout is horizontal', () => {
        const result = buildAxis({ type: 'bar', layout: 'horizontal', withAxisCurrencyTickFormatter: true });

        result.xList?.forEach((item) => {
            expect(item.tickFormatter).toBeDefined();
            if (item.tickFormatter) {
                item.tickFormatter(100, 0);
                expect(currencyFormatter).toHaveBeenCalledWith(100);
            }
        });
    });

    it('should call currencyFormatter in yList tickFormatter when withAxisCurrencyTickFormatter is true and layout is vertical', () => {
        const result = buildAxis({ type: 'bar', layout: 'vertical', withAxisCurrencyTickFormatter: true });

        result.yList?.forEach((item) => {
            expect(item.tickFormatter).toBeDefined();
            if (item.tickFormatter) {
                item.tickFormatter(100, 0);
                expect(currencyFormatter).toHaveBeenCalledWith(100);
            }
        });
    });

    it('should call convertToPercent in yList tickFormatter when withPercentFormatter is true and layout is vertical', () => {
        const result = buildAxis({ type: 'bar', layout: 'vertical', withPercentFormatter: true });

        result.yList?.forEach((item) => {
            expect(item.tickFormatter).toBeDefined();
            if (item.tickFormatter) {
                item.tickFormatter(100, 0);
                expect(convertToPercent).toHaveBeenCalledWith(100);
            }
        });
    });

});
