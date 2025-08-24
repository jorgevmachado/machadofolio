import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Spinner } from '@repo/ds';

type SpinnerProps = React.ComponentProps<typeof Spinner>;

import { LoadingProvider, useLoading } from './LoadingContext'


function TestConsumer(spinnerProps?: SpinnerProps) {
    const { show, hide, isLoading } = useLoading();
    return (
        <div>
            <button data-testid={`show-btn-${spinnerProps?.type ?? 'none'}`} onClick={() => show(spinnerProps?.type ? spinnerProps : undefined)}>Show Loading</button>
            <button data-testid={`hide-btn-${spinnerProps?.type ?? 'none'}`} onClick={() => hide()} disabled={!isLoading}>Hide Loading</button>
            <span data-testid="content">Conteúdo da Página</span>
        </div>
    );
}

describe('Loading Hook', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('does not display Spinner initially.', () => {
        render(
            <LoadingProvider>
                <TestConsumer />
            </LoadingProvider>
        );
        expect(screen.queryByTestId('mocked-ds-spinner')).not.toBeInTheDocument();
    });

    it('should display default center spinner when show is called.', () => {
        const type = 'none';
        render(
            <LoadingProvider>
                <TestConsumer />
            </LoadingProvider>
        );
        fireEvent.click(screen.getByTestId(`show-btn-${type}`));
        const spinnerComponent = screen.getByTestId('mocked-ds-spinner');
        expect(spinnerComponent).toBeInTheDocument();
        expect(spinnerComponent.parentElement).toHaveStyle('position: fixed');
    });

    it('Should display dots type spinner.', () => {
        const type = 'dots';
        render(
            <LoadingProvider>
                <TestConsumer type={type} size={60} />
            </LoadingProvider>
        );
        fireEvent.click(screen.getByTestId(`show-btn-${type}`));
        const spinnerComponent = screen.getByTestId('mocked-ds-spinner');
        expect(spinnerComponent).toBeInTheDocument();
        expect(spinnerComponent.parentElement).toHaveStyle('position: fixed');
    });

    it('Should display bar type spinner.', () => {
        const type = 'bar';
        render(
            <LoadingProvider>
                <TestConsumer type={type} size={2} />
            </LoadingProvider>
        );
        fireEvent.click(screen.getByTestId(`show-btn-${type}`));
        const spinnerComponent = screen.getByTestId('mocked-ds-spinner');
        expect(spinnerComponent).toBeInTheDocument();
        expect(spinnerComponent.parentElement).toHaveStyle('position: fixed');
        const overlays = document.querySelectorAll('[aria-hidden="true"]');
        expect(overlays.length).toBe(1);
    });

    it('must remove the spinner when hiding.', () => {
        const type = 'bar';
        render(
            <LoadingProvider>
                <TestConsumer type={type} size={2} />
            </LoadingProvider>
        );
        fireEvent.click(screen.getByTestId(`show-btn-${type}`));
        expect(screen.getByTestId('mocked-ds-spinner')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId(`hide-btn-${type}`));
        expect(screen.queryByTestId("mock-spinner")).not.toBeInTheDocument();
    });
})