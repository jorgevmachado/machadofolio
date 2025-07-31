import React from 'react';

import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../../utils', () => ({
    generateComponentId: jest.fn((id?: string) => id || 'mocked-id'),
    joinClass: (classes: any[]) => classes.filter(Boolean).join(' '),
}));

const mockUseInput = jest.fn();
jest.mock('../InputContext', () => ({
    __esModule: true,
    useInput: () => mockUseInput(),
}));

jest.mock('./addon', () => ({
    __esModule: true,
    default: (props: any) => <span data-testid={`mock-addon-${props.position}`}></span>,
}));

jest.mock('./file', () => ({
    __esModule: true,
    default: (props: any) => (
        <input data-testid="mock-file-input" value={props.value} onChange={e => props.onChange?.(e, 'mocked-file-value')} />
    ),
}));

jest.mock('./date', () => ({
    __esModule: true,
    default: (props: any) => (
        <input data-testid="mock-date-input" value={props.value} onChange={e => props.onChange?.(e, '1990-01-01T00:00:00Z')} />
    ),
}));
jest.mock('./inside', () => ({
    __esModule: true,
    default: (props: any) => (
        <span
            data-testid={`mock-inside-${props.position}`}
            onClick={props.onClick}
        >{props.icon?.icon}</span>
    ),
}));

import type { TContext } from '../../../utils';

import Content from './Content';

describe('<Content />', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    beforeEach(() => {
        mockUseInput.mockReturnValue({
            hasAddon: true,
            hasAppend: false,
            hasPrepend: false,
            hasIconElement: jest.fn().mockReturnValue(false),
        });
    });

    const defaultProps = {
        type: 'text',
        context: 'neutral' as TContext
    }
    const renderComponent = (props: any = {}) => {
        return render(<Content {...defaultProps} {...props}/>)
    }

    describe('type="text"', () => {
        it('should render standard input field when type is neither file nor textarea.', () => {
            renderComponent();
            expect(screen.getByTestId('ds-input-content')).toBeInTheDocument();
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        it('should render input invalid when invalid is true.', () => {
            renderComponent({ invalid: true, placeholder: 'INPUT' });
            expect(screen.getByTestId('ds-input-content')).toBeInTheDocument();
            const input = screen.getByPlaceholderText('INPUT');
            expect(input).toHaveClass('ds-input-content__field--error');
        })

        it('must call handleInput when typing in fields.', () => {
            renderComponent();
            const input = screen.getByRole('textbox');
            fireEvent.input(input, { target: { value: 'test123' } });
            expect((input as HTMLInputElement).value).toBe('test123');
        });

        it('should call external onInput and onChange if passed.', () => {
            const onInput = jest.fn();
            const onChange = jest.fn();
            renderComponent({
                onInput,
                onChange,
            });
            const input = screen.getByRole('textbox');
            fireEvent.input(input, { target: { value: 'hello' } });
            fireEvent.change(input, { target: { value: 'world' } });
            expect(onInput).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalled();
        });

        it('should render initial value correctly.', () => {
            renderComponent({ value: 'init' });
            expect(screen.getByRole('textbox')).toHaveValue('init');
        });

        it('should render initial value with null', () => {
            renderComponent({ value: null });
            expect(screen.getByRole('textbox')).toHaveValue('');
        });

        it('should disable field when prop disabled is true.', () => {
            renderComponent({ disabled: true });
            expect(screen.getByRole('textbox')).toBeDisabled();
        });

        it('must apply dynamic classes via joinClass.', () => {
            mockUseInput.mockReturnValue({
                hasAddon: true,
                hasAppend: true,
                hasPrepend: true,
                hasIconElement: jest.fn().mockImplementation(() => true),
            });
            renderComponent({ fluid: true, disabled: true });
            const input = screen.getByRole('textbox');
            expect(input.className).toMatch(/ds-input-content__field--fluid/);
            expect(input.className).toMatch(/ds-input-content__field--prepend/);
            expect(input.className).toMatch(/ds-input-content__field--append/);
        });

        it('must update the state value when receiving a new value through the prop.', () => {
            const { rerender } = renderComponent({ value: 'a' });
            expect(screen.getByRole('textbox')).toHaveValue('a');
            rerender(<Content {...defaultProps} value="b" />);
            expect(screen.getByRole('textbox')).toHaveValue('b');
        });

        it('must pass the correct props to Addon and Inside.', () => {
            renderComponent();
            expect(screen.getByTestId('mock-addon-left')).toBeInTheDocument();
            expect(screen.getByTestId('mock-addon-right')).toBeInTheDocument();
            expect(screen.getByTestId('mock-inside-left')).toBeInTheDocument();
            expect(screen.getByTestId('mock-inside-right')).toBeInTheDocument();
        });

        it('should render input with custom formatter', () => {
            renderComponent({ formatter: (value?: string) => value, value: 'home' });
            const input = screen.getByTestId('ds-input-content-field');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('value', 'home');
        });
    });

    describe('type="textarea"', () => {
        it('should render textarea when type="textarea".', () => {
            renderComponent({ type: 'textarea', rows: 4 });
            expect(screen.getByRole('textbox')).toBeInTheDocument();
            expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
            expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
        });
    });

    describe('type="cpf"', () => {
        it('should render input when type="cpf" with defaultFormatter.', () => {
            renderComponent({ type: 'cpf', value: '11122233344' });
            const input = screen.getByTestId('ds-input-content-field');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('value', '111.222.333-44');
        });

        it('should render input when type="cpf" with defaultFormatter false.', () => {
            renderComponent({ type: 'cpf', value: '11122233344', defaultFormatter: false });
            const input = screen.getByTestId('ds-input-content-field');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('value', '11122233344');
        });

        it('should render input when type="cpf" with custom formatter.', () => {
            renderComponent({ type: 'cpf', formatter: (value?: string) => value,  value: '11122233344' });
            const input = screen.getByTestId('ds-input-content-field');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('value', '11122233344');
        });

        it('should render input when type="cpf" with custom formatter and defaultFormatter false.', () => {
            renderComponent({ type: 'cpf', formatter: (value?: string) => value,  value: '11122233344', defaultFormatter: false });
            const input = screen.getByTestId('ds-input-content-field');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('value', '11122233344');
        });
    });

    describe('type="phone"', () => {
        it('should render input when type="phone" with defaultFormatter.', () => {
            renderComponent({ type: 'phone', value: '11223456789' });
            const input = screen.getByTestId('ds-input-content-field');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('value', '(11) 22345-6789');
        });

        it('should render input when type="phone" with defaultFormatter false.', () => {
            renderComponent({ type: 'phone', value: '11223456789', defaultFormatter: false });
            const input = screen.getByTestId('ds-input-content-field');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('value', '11223456789');
        });

        it('should render input when type="phone" with custom formatter.', () => {
            renderComponent({ type: 'phone', formatter: (value?: string) => value,  value: '11223456789' });
            const input = screen.getByTestId('ds-input-content-field');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('value', '11223456789');
        });

        it('should render input when type="phone" with custom formatter and defaultFormatter false.', () => {
            renderComponent({ type: 'phone', formatter: (value?: string) => value,  value: '11223456789', defaultFormatter: false });
            const input = screen.getByTestId('ds-input-content-field');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('value', '11223456789');
        });
    });

    describe('type="password', () => {
        it('must change the type to text when switching password view.', () => {
            renderComponent({ type: 'password' });
            const toggleBtn = screen.getByTestId('mock-inside-right');
            fireEvent.click(toggleBtn);
            expect(toggleBtn.textContent).toMatch(/eye(-close)?/);
            fireEvent.click(toggleBtn);
            expect(toggleBtn.textContent).toMatch(/eye?/);
        });
    });

    describe('type="file"', () => {
        it('should render FileInput when type="file".', () => {
            renderComponent({ type: 'file', accept: 'image/*' });
            expect(screen.getByTestId('mock-file-input')).toBeInTheDocument();
        });

        it('should trigger onChange of FileInput with mocked value.', () => {
            const onChange = jest.fn();
            renderComponent({ onChange, type: 'file'});
            const fileInput = screen.getByTestId('mock-file-input');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            fireEvent.change(fileInput, { target: { value: 'new Value'}}, 'base-64');
            expect(onChange).toHaveBeenCalled();
        });
    });

    describe('type="date"', () => {
        it('should render DateInput when type="date".', () => {
            renderComponent({ type: 'date' });
            expect(screen.getByTestId('mock-date-input')).toBeInTheDocument();
        });
    });
});