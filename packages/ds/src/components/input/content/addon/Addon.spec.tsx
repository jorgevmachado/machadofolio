import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../../../../utils', () => ({
    joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
}));

const mockUseInput = jest.fn();
jest.mock('../../InputContext', () => ({
    __esModule: true,
    useInput: () => mockUseInput(),
}));

import Addon from './Addon';


describe('<Addon/>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    const defaultProps = {
        show: true,
        position: 'left'
    }

    const renderComponent = (props: any = {}) => {
        return render(<Addon {...defaultProps} {...props}/>);
    }

    it('should not render anything if there are no children related to the given position', () => {
        mockUseInput.mockReturnValue({
            hasAddon: false,
            hasAppend: false,
            hasPrepend: false,
            addonElement: undefined,
            appendElement: undefined,
            prependElement: undefined,
        });
        const { container } = renderComponent();
        expect(container.firstChild).toBeNull();
    });

    it('should not render anything if flag show is false', () => {
        mockUseInput.mockReturnValue({
            hasAddon: false,
            hasAppend: false,
            hasPrepend: false,
            addonElement: undefined,
            appendElement: undefined,
            prependElement: undefined,
        });
        const { container } = renderComponent( { show: false });
        expect(container.firstChild).toBeNull();
    });

    it('should render prepend correctly when position is left and hasPrepend=true', () => {
        mockUseInput.mockReturnValue({
            hasAddon: false,
            hasAppend: false,
            hasPrepend: true,
            addonElement: undefined,
            appendElement: undefined,
            prependElement: <span data-testid="prepend-element">prepend</span>,
        });

        renderComponent();
        const addon = screen.getByTestId('ds-addon');
        expect(addon).toBeInTheDocument();
        expect(addon).toHaveClass('ds-addon ds-addon__prepend');
        expect(screen.getByTestId('prepend-element')).toBeInTheDocument();
    });

    it('should render addon correctly when position is right, hasAddon=true and it is not append', () => {
        mockUseInput.mockReturnValue({
            hasAddon: true,
            hasAppend: false,
            hasPrepend: false,
            addonElement: <span data-testid="addon-element">addon</span>,
            appendElement: undefined,
            prependElement: undefined,
        });

        renderComponent({ position: 'right' });
        const addon = screen.getByTestId('ds-addon');
        expect(addon).toBeInTheDocument();
        expect(addon).toHaveClass('ds-addon ds-addon__content');
        expect(screen.getByTestId('addon-element')).toBeInTheDocument();
    });

    it('should render append correctly when position is right and hasAppend=true', () => {
        mockUseInput.mockReturnValue({
            hasAddon: false,
            hasAppend: true,
            hasPrepend: false,
            addonElement: undefined,
            appendElement: <span data-testid="append-element">append</span>,
            prependElement: undefined,
        });

        renderComponent({ position: 'right' });
        const addon = screen.getByTestId('ds-addon');
        expect(addon).toBeInTheDocument();
        expect(addon).toHaveClass('ds-addon ds-addon__append');
        expect(screen.getByTestId('append-element')).toBeInTheDocument();
    });

    it('should present when there are multiples, order: prepend, addon, append', () => {
        mockUseInput.mockReturnValue({
            hasAddon: true,
            hasAppend: true,
            hasPrepend: true,
            addonElement: <span data-testid="addon-element">addon</span>,
            appendElement: <span data-testid="append-element">append</span>,
            prependElement: <span data-testid="prepend-element">prepend</span>,
        });

        renderComponent();
        expect(screen.getByTestId('prepend-element')).toBeInTheDocument();
        expect(screen.queryByTestId('addon-element')).toBeNull();
        expect(screen.queryByTestId('append-element')).toBeNull();
        cleanup();

        renderComponent({ position: 'right' });
        expect(screen.getByTestId('append-element')).toBeInTheDocument();
        expect(screen.queryByTestId('addon-element')).toBeNull();
        expect(screen.queryByTestId('prepend-element')).toBeNull();
    });

    it('should not add extra class when it is not prepend, append or addon', () => {
        mockUseInput.mockReturnValue({
            hasAddon: false,
            hasAppend: false,
            hasPrepend: false,
            addonElement: undefined,
            appendElement: undefined,
            prependElement: undefined,
        });

        const { container } = renderComponent({ position: 'right' });
        expect(container.firstChild).toBeNull();
    });
});