import React from 'react';

import '@testing-library/jest-dom'
import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';

import Dropdown from './Dropdown';
import useDropdown from './useDropdown';

jest.mock('../../utils', () => {
    const originalModule = jest.requireActual('../../utils');
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
    }
});

let outsideHandler: any;
jest.mock('../../hooks', () => ({
    useOutsideClick: (ref: any, handler: any) => {
        outsideHandler = handler;
    }
}));

jest.mock('../button', () => ({
    __esModule: true,
    default: (props: any) => (<button {...props} data-testid="mock-button"/>),
    Button: (props: any) => (<button {...props} data-testid="mock-button"/>),
}));

jest.mock('../link', () => ({
    __esModule: true,
    default: (props: any) => (<a {...props} data-testid="mock-link"/>),
    Link: (props: any) => (<a {...props} data-testid="mock-link"/>),
}));


describe('<Dropdown/>', () => {
    const defaultProps = {
        type: 'button',
        label: 'activator',
        context: 'neutral',
        disabled: false,
        children: 'Hello, World!',
    };

    const renderComponent = (props: any = {}) => {
        return render(<Dropdown {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with default props.', () => {
        renderComponent();
        const component = screen.getByTestId('ds-dropdown');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-dropdown');
    });

    it('should include an extra class if provided', () => {
        renderComponent({ className: 'custom-drop' });
        expect(screen.getByTestId('ds-dropdown')).toHaveClass('custom-drop');
    });

    it('should include the context class', () => {
        renderComponent({ context: 'success' });
        expect(screen.getByTestId('ds-dropdown')).toHaveClass('ds-dropdown__context--success');
    });

    it('should render the default activator if "activator" is not provided', () => {
        renderComponent();
        expect(screen.getByText('activator')).toBeInTheDocument();
    });

    it('should render the custom activator when provided', () => {
        renderComponent({ activator: <button data-testid="custom-activator">Activate</button> });
        expect(screen.getByTestId('custom-activator')).toBeInTheDocument();
    });

    it('should toggle isOpen and call onDropDownClick correctly when clicking the activator', () => {
        const onDropDownClick = jest.fn();
        renderComponent({ type: 'link', onDropDownClick });
        fireEvent.click(screen.getByTestId('ds-dropdown').firstChild as HTMLElement);
        expect(screen.getByTestId('ds-dropdown-action')).toBeInTheDocument();
        expect(onDropDownClick).toHaveBeenCalledWith(true);
    });

    it('should close the dropdown when clicking the activator while open', () => {
        const onDropDownClick = jest.fn();
        renderComponent({ onDropDownClick });
        fireEvent.click(screen.getByTestId('ds-dropdown').firstChild as HTMLElement);
        expect(screen.getByTestId('ds-dropdown-action')).toBeInTheDocument();
        expect(onDropDownClick).toHaveBeenCalledWith(true);

        fireEvent.click(screen.getByTestId('ds-dropdown').firstChild as HTMLElement);
        expect(onDropDownClick).toHaveBeenCalledWith(false);
    });

    it('should not open or close if disabled', () => {
        const onDropDownClick = jest.fn();
        renderComponent({ onDropDownClick, disabled: true });
        fireEvent.click(screen.getByTestId('ds-dropdown').firstChild as HTMLElement);
        expect(onDropDownClick).not.toHaveBeenCalled();
    });

    it('should call onClickOutside and onDropDownClick when clicking outside', () => {
        const onDropDownClick = jest.fn();
        const onClickOutside = jest.fn();

        renderComponent({ onDropDownClick, onClickOutside });
        fireEvent.click(screen.getByTestId('ds-dropdown').firstChild as HTMLElement);

        act(() => {
            if (outsideHandler) {
                outsideHandler();
            }
        });

        expect(onClickOutside).toHaveBeenCalledWith(true);
        expect(onDropDownClick).toHaveBeenCalledWith(false);
    });


    describe('useDropdown', () => {
        afterEach(() => {
            cleanup();
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        it('should start closed (isOpen = false)', () => {
            const { result } = renderHook(() => useDropdown());
            expect(result.current.isOpen).toBe(false);
        });

        it('toggleDropdown should toggle the isOpen state', () => {
            const { result } = renderHook(() => useDropdown());
            act(() => {
                result.current.toggleDropdown();
            });
            expect(result.current.isOpen).toBe(true);

            act(() => {
                result.current.toggleDropdown();
            });
            expect(result.current.isOpen).toBe(false);
        });

        it('setIsOpen should set isOpen directly', () => {
            const { result } = renderHook(() => useDropdown());
            act(() => {
                result.current.setIsOpen(true);
            });
            expect(result.current.isOpen).toBe(true);

            act(() => {
                result.current.setIsOpen(false);
            });
            expect(result.current.isOpen).toBe(false);
        });

        it('should initialize open if isExternalOpen is true on creation', () => {
            const { result } = renderHook(() => useDropdown(true));
            expect(result.current.isOpen).toBe(true);
        });

        it('should initialize closed if isExternalOpen is false on creation', () => {
            const { result } = renderHook(() => useDropdown(false));
            expect(result.current.isOpen).toBe(false);
        });

        it('should update isOpen when isExternalOpen changes to true', () => {
            const { result, rerender } = renderHook(
                ({ isExternalOpen }) => useDropdown(isExternalOpen),
                { initialProps: { isExternalOpen: false } }
            );
            expect(result.current.isOpen).toBe(false);

            rerender({ isExternalOpen: true });
            expect(result.current.isOpen).toBe(true);
        });

        it('should update isOpen when isExternalOpen changes to false', () => {
            const { result, rerender } = renderHook(
                ({ isExternalOpen }) => useDropdown(isExternalOpen),
                { initialProps: { isExternalOpen: true } }
            );
            expect(result.current.isOpen).toBe(true);

            rerender({ isExternalOpen: false });
            expect(result.current.isOpen).toBe(false);
        });

        it('should allow internal toggle even if external value is undefined (uncontrolled)', () => {
            const { result } = renderHook(() => useDropdown());
            act(() => result.current.toggleDropdown());
            expect(result.current.isOpen).toBe(true);
            act(() => result.current.toggleDropdown());
            expect(result.current.isOpen).toBe(false);
        });

        it('external undefined: setIsOpen should also work normally', () => {
            const { result } = renderHook(() => useDropdown());
            act(() => result.current.setIsOpen(true));
            expect(result.current.isOpen).toBe(true);
            act(() => result.current.setIsOpen(false));
            expect(result.current.isOpen).toBe(false);
        });


    });

});