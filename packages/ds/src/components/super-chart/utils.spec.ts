import React from 'react';

jest.mock('./content', () => ({
  ChartContentTooltip: jest.fn((props = {}) => React.createElement('div', { 'data-testid': 'mock-tooltip', ...props })),
  ChartContentLegend: jest.fn((props = {}) => React.createElement('div', { 'data-testid': 'mock-legend', ...props })),
}));

import { buildTooltip, buildLegend } from './utils';
import type { TooltipProps, LegendProps } from './types';

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
});
