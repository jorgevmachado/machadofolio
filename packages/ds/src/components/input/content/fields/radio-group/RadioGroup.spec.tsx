import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../../../../utils', () => {
    const originalModule = jest.requireActual('../../../../../utils');
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
    }
});

jest.mock('../../../../button', () => ({
    __esModule: true,
    default: ({ 'data-testid': dataTestId = 'mock-button', ...props}: any) => (<button { ...props} data-testid={dataTestId}/>),
}));

import { EContext, EInputAppearance } from '../../../../../utils';

import RadioGroup from './RadioGroup';


describe('<RadioGroup/>', () => {
    const defaultProps = {
        context: EContext.PRIMARY,
        options: [
            {
                label: 'Option 1',
                value: 'option1',
            },
            {
                label: 'Option 2',
                value: 'option2',
            }
        ],
        appearance: EInputAppearance.STANDARD,
    };


    const Component = ({ value = 'option1', onClick = jest.fn(), ...props }: any = {}) => {
        const [selected, setSelected] = React.useState<string | Array<string>>(value);
        return (
            <RadioGroup
                {...defaultProps}
                {...props}
                value={selected}
                onClick={(e, newValues) => {
                    setSelected(Array.isArray(newValues) ? newValues : [String(newValues)]);
                    onClick(e, newValues);
                }}
            />
        )
    }

    const renderComponent = (props: any = {}) => {
        return render(<Component {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ds-radio-group');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-radio-group');
    });

    it('should render the correct number of radio inputs and buttons', () => {
        renderComponent();
        expect(screen.getAllByRole('radio')).toHaveLength(2);
        expect(screen.getAllByTestId(/ds-radio-group-field-/)).toHaveLength(2);
        expect(screen.getAllByTestId(/ds-radio-group-button-/)).toHaveLength(2);
    });

    it('should check the input and set proper class when value is selected', () => {
        renderComponent({ value: 'option1' });
        const input0 = screen.getByTestId('ds-radio-group-field-0') as HTMLInputElement;
        const input1 = screen.getByTestId('ds-radio-group-field-1') as HTMLInputElement;
        const button0 = screen.getByTestId('ds-radio-group-button-0');
        expect(input0.checked).toBe(true);
        expect(input1.checked).toBe(false);
        expect(button0.className).toContain('-checked');
    });

    it('should call onClick with proper value (single)', () => {
        const onClick = jest.fn();
        renderComponent({ value: 'option2', onClick });
        const button0 = screen.getByTestId('ds-radio-group-button-0');
        fireEvent.click(button0);
        expect(onClick).toHaveBeenCalledWith(expect.any(Object), 'option1');
    });

    it('should call onClick with updated values array (multiple selected)', () => {
        const onClick = jest.fn();
        renderComponent({ value: ['option1'], multiple: true, onClick });
        const button1 = screen.getByTestId('ds-radio-group-button-1');
        fireEvent.click(button1);
        expect(onClick).toHaveBeenLastCalledWith(expect.any(Object), ['option1', 'option2']);

        const button0 = screen.getByTestId('ds-radio-group-button-0');
        fireEvent.click(button0);
        expect(onClick).toHaveBeenLastCalledWith(expect.any(Object), ['option2']);
    });

    it('should call onClick with value is string and updated values array (multiple selected)', () => {
        const onClick = jest.fn();
        renderComponent({ value: 'option1', multiple: true, onClick });
        const button1 = screen.getByTestId('ds-radio-group-button-1');
        fireEvent.click(button1);
        expect(onClick).toHaveBeenLastCalledWith(expect.any(Object), ['option1', 'option2']);

        const button0 = screen.getByTestId('ds-radio-group-button-0');
        fireEvent.click(button0);
        expect(onClick).toHaveBeenLastCalledWith(expect.any(Object), ['option2']);
    });

    it('should call onClick with value is string and updated value', () => {
        const onClick = jest.fn();
        renderComponent({ value: 'option1', multiple: false, onClick });
        const button1 = screen.getByTestId('ds-radio-group-button-1');
        fireEvent.click(button1);
        expect(onClick).toHaveBeenLastCalledWith(expect.any(Object), 'option2');
    });

    it('should set disabled prop on Button', () => {
        renderComponent({ disabled: true });
        const btn = screen.getByTestId('ds-radio-group-button-0');
        expect(btn).toBeDisabled();
    });

    it('should reflect tabIndex according to selection', () => {
        renderComponent({ value: 'option1' });
        const btn0 = screen.getByTestId('ds-radio-group-button-0');
        const btn1 = screen.getByTestId('ds-radio-group-button-1');
        expect(btn0.tabIndex).toBe(0); // selected
        expect(btn1.tabIndex).toBe(-1); // not selected
    });

    it('should render with custom id', () => {
        renderComponent({ id: 'test-radio-group' });
        expect(screen.getByTestId('ds-radio-group-field-0')).toHaveAttribute('id', 'test-radio-group');
    });

    it('should handle undefined options gracefully', () => {
        render(<RadioGroup context="primary" options={[]} appearance="standard" />);
        expect(screen.getByTestId('ds-radio-group')).toBeInTheDocument();
    });

    it('should render classes for context and appearance', () => {
        renderComponent({ context: 'secondary', appearance: 'outline' });
        const group = screen.getByTestId('ds-radio-group');
        expect(group.className).toContain('ds-radio-group__context--secondary');
        expect(group.className).toContain('ds-radio-group__appearance--outline');
    });
});