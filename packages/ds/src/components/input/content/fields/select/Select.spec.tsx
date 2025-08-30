import React from 'react';

import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import SelectInput from './Select';

jest.mock('../../../../../utils', () => ({
    joinClass: (classes: any[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('../../../../../elements', () => ({
    Icon: (props: any) => <span data-testid="mock-icon" {...props} />,
}));

describe('<SelectInput>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    const mockOnInput = jest.fn();
    const mockOnChange = jest.fn();

    const defaultProps = {
        id: 'select',
        options: [
            {
                label: 'Option 1',
                value: 'option1'
            },
            {
                label: 'Option 2',
                value: 'option2'
            }
        ],
        onInput: mockOnInput,
        onChange: mockOnChange
    }

    const rendeComponent = (props: any = {}) => {
        return render(<SelectInput {...defaultProps} {...props}/>)
    }

    it('should render correctly with minimal props', () => {
        rendeComponent();
        expect(screen.getByTestId('ds-select')).toBeInTheDocument();
        const selectPlaceholder = screen.getByTestId('ds-select-placeholder');
        expect(selectPlaceholder).toBeInTheDocument();
        expect(selectPlaceholder).toHaveTextContent('Select...');
    });

    it('should render correctly with a value', () => {
        rendeComponent({ value: 'option1' });
        expect(screen.getByTestId('ds-select')).toBeInTheDocument();
        const selectPlaceholder = screen.getByTestId('ds-select-placeholder');
        expect(selectPlaceholder).toBeInTheDocument();
        expect(selectPlaceholder).toHaveTextContent('Option 1');
    });

    it('should call onChange and onInput when option is selected', async () => {
        rendeComponent();
        fireEvent.click(screen.getByTestId('ds-select-placeholder'));
        const option = screen.getByText('Option 2');
        fireEvent.click(option);
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), 'option2');
            expect(mockOnInput).toHaveBeenCalledWith(expect.any(Object), 'option2');
        });
    });

    it('should open dropdown on click and close on outside click', async () => {
        rendeComponent();
        fireEvent.click(screen.getByTestId('ds-select-placeholder'));
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        fireEvent.mouseDown(document.body);
        await waitFor(() => {
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        });
    });

    it('should handle keyboard navigation and selection', async () => {
        rendeComponent();
        const control = screen.getByRole('combobox');
        fireEvent.keyDown(control, { key: 'ArrowDown' });
        fireEvent.keyDown(control, { key: 'ArrowDown' });
        fireEvent.keyDown(control, { key: 'ArrowUp' });
        fireEvent.keyDown(control, { key: 'Enter' });
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), 'option1');
        });
    });

    it('should close dropdown on Escape and Tab', async () => {
        rendeComponent();
        const control = screen.getByRole('combobox');
        fireEvent.click(control);
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        fireEvent.keyDown(control, { key: 'Escape' });
        await waitFor(() => {
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        });
        fireEvent.click(control);
        fireEvent.keyDown(control, { key: 'Tab' });
        await waitFor(() => {
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        });
    });

    it('should not open dropdown if disabled', () => {
        rendeComponent({ disabled: true });
        const control = screen.getByRole('combobox');
        fireEvent.click(control);
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
        rendeComponent({ className: 'custom-class' });
        expect(screen.getByRole('combobox')).toHaveClass('custom-class');
    });

    it('should show placeholder if no value selected', () => {
        rendeComponent({ value: '' });
        expect(screen.getByTestId('ds-select-placeholder')).toHaveTextContent('Select...');
    });

    it('should set aria attributes correctly', () => {
        rendeComponent();
        const control = screen.getByRole('combobox');
        expect(control).toHaveAttribute('aria-label', 'Select...');
        fireEvent.click(control);
        expect(control).toHaveAttribute('aria-expanded', 'true');
        expect(control).toHaveAttribute('aria-controls', 'select-dropdown');
    });

    it('should highlight focused option on mouse enter', () => {
        rendeComponent();
        fireEvent.click(screen.getByTestId('ds-select-placeholder'));
        const option = screen.getByText('Option 2');
        fireEvent.mouseEnter(option);
        expect(option).toHaveClass('ds-select__option--focused');
    });

    it('should show selected option visually', () => {
        rendeComponent({ value: 'option2' });
        fireEvent.click(screen.getByTestId('ds-select-placeholder'));

        const selectedOptions = screen.getAllByRole('option').filter(
            el => el.classList.contains('ds-select__option--selected')
        );
        expect(selectedOptions).toHaveLength(1);
        expect(selectedOptions[0]).toHaveTextContent('Option 2');
    });

    it('should handle closing animation state', async () => {
        rendeComponent();
        fireEvent.click(screen.getByTestId('ds-select-placeholder'));
        const option = screen.getByText('Option 2');
        fireEvent.click(option);
        await waitFor(() => {
            expect(screen.getByRole('listbox')).toHaveClass('ds-select__dropdown--closing');
        });
    });

    it('should update selectedValue when value prop changes', () => {
        const { rerender } = rendeComponent({ value: 'option1' });
        expect(screen.getByTestId('ds-select-placeholder')).toHaveTextContent('Option 1');
        rerender(<SelectInput {...defaultProps} value="option2" />);
        expect(screen.getByTestId('ds-select-placeholder')).toHaveTextContent('Option 2');
    });

    it('should not respond to keyboard events when disabled', () => {
        rendeComponent({ disabled: true });
        const control = screen.getByRole('combobox');
        fireEvent.keyDown(control, { key: 'ArrowDown' });
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        fireEvent.keyDown(control, { key: 'Enter' });
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should handle Enter with focused index out of bounds (no option selected)', () => {
        const { getByRole } = rendeComponent({ options: [] });
        const control = getByRole('combobox');

        fireEvent.click(control);

        fireEvent.keyDown(control, { key: 'Enter' });

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

        expect(screen.getByTestId('ds-select-placeholder')).toHaveTextContent('Select...');
    });

    it('should call selectOption with empty string if focused index is out of bounds', async () => {
        rendeComponent();
        const control = screen.getByRole('combobox');
        fireEvent.click(control);

        fireEvent.keyDown(control, { key: 'ArrowDown' });
        fireEvent.keyDown(control, { key: 'ArrowDown' });
        fireEvent.keyDown(control, { key: 'ArrowDown' });
        fireEvent.keyDown(control, { key: 'ArrowDown' });

        fireEvent.keyDown(control, { key: 'ArrowUp' });
        fireEvent.keyDown(control, { key: 'ArrowUp' });
        fireEvent.keyDown(control, { key: 'ArrowUp' });

        fireEvent.keyDown(control, { key: 'Enter' });
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), 'option1');
        });
    });
});