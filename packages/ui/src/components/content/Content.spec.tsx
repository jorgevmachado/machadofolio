import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../../animations', () => ({
    Fade: ({ children, ...props }: any) => <div data-testid="ds-fade" {...props}>{children}</div>
}));

import Content from './Content';

describe('<Content/>', () => {
    const defaultProps = {
        children: <div>child</div>
    };

    const renderComponent = (props: any = {}) => {
        return render(<Content {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('ui-content')).toBeInTheDocument();
        expect(screen.getByText('child')).toBeInTheDocument();
        expect(screen.getByText('child').parentElement).toHaveClass('ui-content');
        expect(screen.getByText('child').parentElement).toHaveClass('ui-content__sidebar--open');
    });

    it('should render children correctly', () => {
        renderComponent({ children: <span>my content</span> });
        expect(screen.getByText('my content')).toBeInTheDocument();
    });

    it('should apply closed sidebar class when isSidebarOpen is false', () => {
        renderComponent({ isSidebarOpen: false });
        const wrapper = screen.getByText('child').parentElement;
        expect(wrapper).toHaveClass('ui-content__sidebar--closed');
        expect(wrapper).not.toHaveClass('ui-content__sidebar--open');
    });

    it('should render title when provided', () => {
        renderComponent({ title: 'My Title' });
        expect(screen.getByTestId('mocked-ds-text')).toBeInTheDocument();
        expect(screen.getByTestId('mocked-ds-text').textContent).toBe('My Title');
        expect(screen.getByTestId('mocked-ds-text').tagName.toLowerCase()).toBe('h1');
    });

    it('should not render title when not provided', () => {
        renderComponent();
        expect(screen.queryByTestId('mock-text')).not.toBeInTheDocument();
    });

    it('should render with Fade wrapper when withAnimation is true', () => {
        renderComponent({ withAnimation: true });
        expect(screen.getByTestId('ds-fade')).toBeInTheDocument();
    });

    it('should render without Fade when withAnimation is false or not set', () => {
        renderComponent();
        expect(screen.queryByTestId('ds-fade')).not.toBeInTheDocument();
    });

    it('should render properly if children is just a string', () => {
        renderComponent({ children: 'texto puro' });
        expect(screen.getByText('texto puro')).toBeInTheDocument();
    });

    it('should handle rendering with both title and children', () => {
        renderComponent({ title: 'The Title', children: <span>Hi</span> });
        expect(screen.getByTestId('mocked-ds-text').textContent).toBe('The Title');
        expect(screen.getByText('Hi')).toBeInTheDocument();
    });
});