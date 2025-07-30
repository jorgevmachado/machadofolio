import React from 'react';

import '@testing-library/jest-dom';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import DateInput from './Date';

jest.mock('../../../../utils', () => ({
    joinClass: (classes: any[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('../../../../elements', () => ({
    Icon: (props: any) => <span data-testid="mock-icon" {...props} />,
}));

const calendarElementMock = <div data-testid="calendar-element" />;
jest.mock('../../InputContext', () => ({
    useInput: () => ({
        hasCalendar: true,
        calendarElement: calendarElementMock,
    }),
}));

describe('<DateInput>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    const defaultProps = {

    }
    const rendeComponent = (props: any = {}) => {
        return render(<DateInput {...defaultProps} {...props}/>)
    }

    it('should render correctly with minimal props', () => {
        rendeComponent();
        expect(screen.getByTestId('ds-date-input')).toBeInTheDocument();
    });

    it('should pass the placeholder prop', () => {
        rendeComponent({ placeholder: 'DATA' });

        const wrapper = screen.getByTestId('ds-date-input');
        expect(wrapper).toHaveClass('ds-date-input');

        const input = screen.getByPlaceholderText('DATA');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'DATA');
    });

    it('should render the icon on the left by default', () => {
        rendeComponent({ icon: { icon: 'calendar', className: 'custom-icon-classname' }, placeholder: 'DATA' });
        expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
        expect(screen.getByTestId('mock-icon')).toHaveClass('ds-date-input__icon', 'ds-date-input__icon--left', 'custom-icon-classname');
    });

    it('should render the icon on the right when specified', () => {
        rendeComponent({ icon: { icon: 'react', position: 'right', className: 'custom-icon-classname' }, placeholder: 'DATA' });
        expect(screen.getByTestId('mock-icon')).toHaveClass('ds-date-input__icon--right', 'custom-icon-classname');
    });

    it('should apply error class when invalid', () => {
        rendeComponent({ invalid: true });
        expect(screen.getByTestId('ds-date-input')).toHaveClass('ds-date-input--error');
    });

    it('should apply error class when invalid', () => {
        rendeComponent({ invalid: true });
        expect(screen.getByTestId('ds-date-input')).toHaveClass('ds-date-input--error');
    });

    it('should call onOpen and onClose when opening/closing calendar', () => {
        const onOpen = jest.fn();
        const onClose = jest.fn();

        rendeComponent({ onOpen, onClose, onCalendarClose: jest.fn(), onCalendarOpen: jest.fn(), placeholder: 'DATA' });
        const input = screen.getByPlaceholderText('DATA');

        fireEvent.click(input);
        expect(onOpen).toHaveBeenCalled();

        fireEvent.keyDown(input, { key: 'Escape' });
        expect(onClose).toHaveBeenCalled();
    });

    it('should correctly pass min, max and value', () => {
        const min = '2022-01-01T00:00:00Z';
        const max = '2022-12-31T00:00:00Z';
        const value = '2022-06-30T00:00:00Z';

        rendeComponent({ min, max, value, placeholder: 'DATA' });
        const input = screen.getByPlaceholderText('DATA');
        expect(input).toHaveValue('06/29/2022');
    });

    it('should correctly pass minDate, maxDate and value', () => {
        const minDate = '2022-01-01T00:00:00Z';
        const maxDate = '2022-12-31T00:00:00Z';
        const value = '2022-06-30T00:00:00Z';

        rendeComponent({ minDate, maxDate, value, placeholder: 'DATA' });
        const input = screen.getByPlaceholderText('DATA');
        expect(input).toHaveValue('06/29/2022');
    });

    it('should trigger onChange when the value changes', async () => {
        const onChange = jest.fn();
        rendeComponent({ onChange, placeholder: 'DATA' });
        const input = screen.getByPlaceholderText('DATA');

        fireEvent.click(input);

        const day = await screen.findByText('25');

        act(() => {
            fireEvent.click(day);
        });

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(
                expect.any(Object),
                expect.stringMatching(/^202[2,5]-\d{2}-\d{2}T/)
            );
        });
    });
});