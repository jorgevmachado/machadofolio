import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const mockCpfValidator = jest.fn(({ value }: any) => ({ valid: true, value, message: 'Valid CPF.' }));
const mockEmailValidator = jest.fn(({ value }: any) => ({ valid: true, value, message: 'Valid Email.' }));
const mockPasswordValidator = jest.fn(({ value }: any) => ({ valid: true, value, message: 'Valid password.' }));
const mockPhoneValidator = jest.fn(({ value }: any) => ({ valid: true, value, message: 'Valid phone number.' }));

jest.mock('@repo/services', () => {
    const originalModule = jest.requireActual('@repo/services');
    return {
        ...originalModule,
        cpfValidator: mockCpfValidator,
        emailValidator: mockEmailValidator,
        passwordValidator: mockPasswordValidator,
        phoneValidator: mockPhoneValidator,
    }
});

jest.mock('../../utils', () => ({
    generateComponentId: jest.fn(() => 'mock-id'),
    joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
}));
jest.mock('../../elements', () => ({
    Text: (props: any) => (<p {...props} data-testid="mock-text">{props.children}</p>),
}));
jest.mock('../label', () => ({
    __esModule: true,
    default: (props: any) => (<label {...props} data-testid="mock-label">{props.label}</label>),
}));
jest.mock('../feedback', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-feedback">{props.children}</div>),
}));
jest.mock('./content', () => ({
    __esModule: true,
    default: (props: any) => (<input data-testid="mock-content" {...props}/>)
}));
jest.mock('./InputContext', () => ({
    __esModule: true,
    InputProvider: ({ children }: any) => <div data-testid="mock-input-provider">{children}</div>,
}));

import Input from './Input';

describe('<Input/>', () => {
    const defaultProps = {
        type: 'text',
    };

    const renderComponent = (props: any = {}) => {
        return render(<Input {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with default props.', () => {
        renderComponent();
        const component = screen.getByTestId('ds-input');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-input');
        expect(screen.getByTestId('mock-content')).toBeInTheDocument();
    });

    it('should renders the label when the label prop is provided', () => {
        renderComponent({ label: 'Test Label'});
        expect(screen.getByTestId('mock-label')).toHaveTextContent('Test Label');
    });

    it('should renders the helperText when the helperText prop is provided', () => {
        renderComponent({ helperText: { color: 'info-80', children: 'Test Helper Text', className: 'custom-helper' }});
        expect(screen.getByTestId('mock-text')).toHaveTextContent('Test Helper Text');
        expect(screen.getByTestId('mock-text')).toHaveClass('ds-input__helper-text');
        expect(screen.getByTestId('mock-text')).toHaveClass('custom-helper');
    });

    it('shows validation feedback when invalid', () => {
        renderComponent({ validated: { invalid: true, message: 'Error!' } });
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Error!');
    });

    it('does not show feedback if invalid is true without a message', () => {
        renderComponent({ validated: { invalid: true } });
        expect(screen.queryByTestId('mock-feedback')).not.toBeInTheDocument();
    });

    it('should render label, HelperText and Feedback with validator invalid and message', () => {
        renderComponent({
                label: 'Test Label',
                validated: { invalid: true, message: 'Invalid' },
                helperText: { children: 'Test Helper Text' }
        });
        expect(screen.getByTestId('mock-label')).toHaveTextContent('Test Label');
        expect(screen.getByTestId('mock-text')).toHaveTextContent('Test Helper Text');
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Invalid');

    });

    it('onInput, onFocus, onChange, onKeyDown, and onMouseDown events are fired', () => {
        const handlers = {
            onInput: jest.fn(),
            onFocus: jest.fn(),
            onChange: jest.fn(),
            onKeyDown: jest.fn(),
            onMouseDown: jest.fn(),
        }
        renderComponent({ ...handlers });
        const content = screen.getByTestId('mock-content');
        fireEvent.focus(content);
        fireEvent.input(content);
        fireEvent.change(content, { target: { value: 'abc' }});
        fireEvent.keyDown(content, { key: 'A' });
        fireEvent.mouseDown(content);

        expect(handlers.onFocus).toHaveBeenCalled();
        expect(handlers.onInput).toHaveBeenCalled();
        expect(handlers.onChange).toHaveBeenCalled();
        expect(handlers.onKeyDown).toHaveBeenCalled();
        expect(handlers.onMouseDown).toHaveBeenCalled();
    });

    it('updates value state and triggers onChange', () => {
        const handleChange = jest.fn();
        renderComponent({ onChange: handleChange });
        const content = screen.getByTestId('mock-content');
        fireEvent.change(content, { target: { value: 'new value' } });
        fireEvent.blur(content, { target: { value: 'new value' } });
        expect(content).toHaveAttribute('value', '');
    });

    it('triggers onBlur and sets invalid state if required and empty', () => {
        const onBlur = jest.fn();
        renderComponent({ required: true, onBlur });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value: '' } });

        expect(onBlur).toHaveBeenCalled();
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('This field is required.');
    });

    it('Should trigger onBlur and set invalid state if required and empty with custom message.', () => {
        const onBlur = jest.fn();
        renderComponent({ required: true, onBlur, validated: { invalid: true, message: 'Custom Message Error.' } });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value: '' } });

        expect(onBlur).toHaveBeenCalled();
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Custom Message Error.');
    });

    it('Should trigger onBlur and set invalid state when input type cpf is not valid by default validator.', () => {
        const value = '12345678901';
        mockCpfValidator.mockReturnValue({ valid: false, value, message: 'Invalid CPF.' });
        const onBlur = jest.fn();
        renderComponent({ type: 'cpf', onBlur });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value } });

        expect(onBlur).toHaveBeenCalled();
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Invalid CPF.');
    });

    it('Should trigger onBlur and set valid state when input type cpf dont have default validator and custom validator.', () => {
        const value = '12345678901';
        const onBlur = jest.fn();
        renderComponent({ type: 'cpf', onBlur, defaultValidator: false });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value } });

        expect(onBlur).toHaveBeenCalled();
    });

    it('Should trigger onBlur and set valid state when input type cpf dont have default validator and have custom validator.', () => {
        const value = '12345678901';
        const onBlur = jest.fn();
        renderComponent({ type: 'cpf', onBlur, defaultValidator: false, validator: () => ({ valid: false, value, message: 'Custom Invalid CPF.' }) });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value } });

        expect(onBlur).toHaveBeenCalled();
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Custom Invalid CPF.');
    });

    it('Should trigger onBlur and set invalid state when input type cpf is not valid by custom validator.', () => {
        const value = '12345678901';
        const onBlur = jest.fn();
        renderComponent({ type: 'cpf', onBlur, validator: () => ({ valid: false, value, message: 'Custom Invalid CPF.' }) });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value } });

        expect(onBlur).toHaveBeenCalled();
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Custom Invalid CPF.');
    });

    it('Should trigger onBlur and set invalid state when input type phone is not valid by default validator.', () => {
        const value = '11223456789';
        mockPhoneValidator.mockReturnValue({ valid: false, value, message: 'Please enter a valid phone number.' });
        const onBlur = jest.fn();
        renderComponent({ type: 'phone', onBlur });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value } });

        expect(onBlur).toHaveBeenCalled();
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Please enter a valid phone number.');
    });

    it('Should trigger onBlur and set invalid state when input type phone is not valid by custom validator.', () => {
        const value = '11223456789';
        const onBlur = jest.fn();
        renderComponent({ type: 'phone', onBlur, validator: () => ({ valid: false, value, message: 'Custom Invalid Phone.' }) });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value } });

        expect(onBlur).toHaveBeenCalled();
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Custom Invalid Phone.');
    });

    it('Should trigger onBlur and set invalid state when input type email is not valid by default validator.', () => {
        const value = 'invalid@mail.com';
        mockEmailValidator.mockReturnValue({ valid: false, value, message: 'Please enter a valid email.' });
        const onBlur = jest.fn();
        renderComponent({ type: 'email', onBlur });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value } });

        expect(onBlur).toHaveBeenCalled();
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Please enter a valid email.');
    });

    it('Should trigger onBlur and set invalid state when input type email is not valid by custom validator.', () => {
        const value = '11223456789';
        const onBlur = jest.fn();
        renderComponent({ type: 'email', onBlur, validator: () => ({ valid: false, value, message: 'Custom Invalid Email.' }) });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value } });

        expect(onBlur).toHaveBeenCalled();
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Custom Invalid Email.');
    });

    it('Should trigger onBlur and set invalid state when input type password is not valid by default validator.', () => {
        const value = 'invalidPassword';
        mockPasswordValidator.mockReturnValue({ valid: false, value, message: 'Please enter a valid password.' });
        const onBlur = jest.fn();
        renderComponent({ type: 'password', onBlur });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value } });

        expect(onBlur).toHaveBeenCalled();
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Please enter a valid password.');
    });

    it('Should trigger onBlur and set invalid state when input type password is not valid by custom validator.', () => {
        const value = 'invalidPassword';
        const onBlur = jest.fn();
        renderComponent({ type: 'password', onBlur, validator: () => ({ valid: false, value, message: 'Custom Invalid Password.' }) });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value } });

        expect(onBlur).toHaveBeenCalled();
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Custom Invalid Password.');
    });

    it('Should trigger onBlur and set invalid state when input type text is not valid by custom validator.', () => {
        const value = 'textInvalid';
        const onBlur = jest.fn();
        renderComponent({ onBlur, validator: () => ({ valid: false, value, message: 'Custom Invalid Text.' }) });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value } });

        expect(onBlur).toHaveBeenCalled();
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Custom Invalid Text.');
    });

});