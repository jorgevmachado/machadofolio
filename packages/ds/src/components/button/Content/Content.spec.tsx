import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

import Content from './Content';

jest.mock('../../../elements', () => ({
    Icon: ({ children }: { children: React.ReactNode }) => (<div className="ds-icon" data-testid="mock-icon">{children}</div>),
    Spinner: ({ children }: { children: React.ReactNode }) => (<div className="ds-spinner" data-testid="mock-icon">{children}</div>),
}));

describe('<Content/>', () => {
    const defaultProps = {
        context: 'primary',
        children: 'button content text',
    };

    const renderComponent = (props: any = {}) => {
        return render(<Content {...defaultProps} {...props}/>);
    };

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render without children', () => {
        renderComponent({ children: undefined });
        expect(screen.getByTestId('ds-button-content')).toBeInTheDocument();
    });


    it('should render component with default values', () => {
        renderComponent();
        expect(screen.getByText(/button content text/i)).toBeInTheDocument();
    });

    it('should render component with left icon.', () => {
        renderComponent({ icon: { icon: 'react', position: 'left' } });
        expect(document.querySelector('.ds-icon')).toBeInTheDocument();
    });

    it('should render component with right icon.', () => {
        renderComponent({ icon: { icon: 'react', position: 'right' } });
        expect(document.querySelector('.ds-icon')).toBeInTheDocument();
    });

    it('should render component with notification count less than 9', () => {
        renderComponent({ notification: { counter: 8 } });
        expect(document.querySelector('.ds-button__content--notification')).toBeInTheDocument();
        expect(screen.getByText(/8/i)).toBeInTheDocument();
    });

    it('should render component with notification count greater than 9', () => {
        renderComponent({ notification: { counter: 10 } });
        expect(document.querySelector('.ds-button__content--notification')).toBeInTheDocument();
        expect(screen.getByText(/9+/i)).toBeInTheDocument();
    });

    it('should not render notification for counter equal zero', () => {
        renderComponent({ notification: { counter: 0 } });
        expect(screen.queryByTestId('ds-button-content-notification')).not.toBeInTheDocument();
    });


    it('should render component with spinner when loading is true', () => {
        renderComponent({ loading: { value: true } });
        expect(document.querySelector('.ds-spinner')).toBeInTheDocument();
    });

    it('should render component with spinner when loading is true with custom context', () => {
        renderComponent({ loading: { value: true, context: 'primary' } });
        expect(document.querySelector('.ds-spinner')).toBeInTheDocument();
    });

    it('should not render icon if position is not left/right', () => {
        renderComponent({ icon: { icon: 'react' } });
        expect(document.querySelector('.ds-icon')).not.toBeInTheDocument();
    });

    it('should not render icon if "icon" is undefined.', () => {
        renderComponent({ icon: undefined });
        expect(document.querySelector('.ds-icon')).not.toBeInTheDocument();
    });

    it('should not render notification if "notification" is undefined.', () => {
        renderComponent({ notification: undefined });
        expect(screen.queryByTestId('ds-button-content-notification')).not.toBeInTheDocument();
    });

    it('should not render spinner if "loading" is undefined.', () => {
        renderComponent({ loading: undefined });
        expect(document.querySelector('.ds-spinner')).not.toBeInTheDocument();
    });

    it('should not render spinner if "loading.value" is false.', () => {
        renderComponent({ loading: { value: false, context: 'primary' } });
        expect(document.querySelector('.ds-spinner')).not.toBeInTheDocument();
    });


});