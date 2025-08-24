import React from 'react';

import '@testing-library/jest-dom'
import { act, cleanup, render, screen } from '@testing-library/react';

import Slide from './Slide';

const advanceTimersByDelay = async (delay: number) => {
    await act(async () => {
        jest.advanceTimersByTime(delay);
    });
};

describe('<Slide/>', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    const getStyle = () => (screen.getByTestId('ui-slide') as HTMLDivElement).style;

    const renderComponent = (props: any = {}) => {
        return render(<Slide {...props} />);
    }

    it('should render component with props default.', () => {
        renderComponent({ children: 'Default Test'});
        expect(getStyle().opacity).toBe('0');
        expect(getStyle().transition).toContain('all');
        expect(screen.getByText('Default Test')).toBeInTheDocument();
        act(() => {
            jest.runAllTimers();
        });
        expect(getStyle().opacity).toBe('1');
        expect(getStyle().transform).toBe('');
        expect(getStyle().transition).toContain('all');
    });

    it('should render children when provided', () => {
        renderComponent({ children: 'My Content' });
        expect(screen.getByText('My Content')).toBeInTheDocument();
    });

    it('should apply styledShow if "enter" is true', async () => {
        renderComponent({ enter: true, delay: 100, timeout: 0.5, transitionType: 'opacity' });
        expect(getStyle().opacity).toBe('0');
        expect(getStyle().transform).toBe('translateX(10px)');
        await advanceTimersByDelay(100);
        expect(getStyle().opacity).toBe('1');
        expect(getStyle().transition).toBe('opacity 0.5s ease-in-out');
    });

    it('should react to prop changes (enter, delay, timeout, direction, transitionType)', async () => {
        const { rerender } = renderComponent({ enter: true, timeout: 0.2, direction: 'right', transitionType: 'height', children: 'Changing' });
        act(() => { jest.runAllTimers(); });
        expect(getStyle().opacity).toBe('1');
        rerender(<Slide enter={false} delay={50} timeout={1} direction="right" transitionType="width">Changing</Slide>)
        await advanceTimersByDelay(50);
        expect(getStyle().opacity).toBe('0');
        expect(getStyle().transform).toBe('translateX(10px)');
        expect(getStyle().transition).toBe('width 1s ease-in-out');
    });

    it('should clean the timer when disassembling', () => {
        const clearSpy = jest.spyOn(global, 'clearTimeout');
        const { unmount } = renderComponent({ delay: 1000, children: 'disassemble' });
        unmount();
        expect(clearSpy).toHaveBeenCalled();
    });

    it('should respect different timeout values', async () => {
        renderComponent({ timeout: 2, children: 'custom timeout' });
        act(() => { jest.runAllTimers(); });
        expect(getStyle().transition).toContain('2s');
    });

    it('should respect different transitionType values', async () => {
        renderComponent({ transitionType: 'opacity', children: 'transition' });
        act(() => { jest.runAllTimers(); });
        expect(getStyle().transition).toContain('opacity');
    });

    it('should allow not to pass children', () => {
        renderComponent();
        expect(screen.getByTestId('ui-slide')).toBeInTheDocument();
        expect(screen.getByTestId('ui-slide').textContent).toBe('');
    });
});