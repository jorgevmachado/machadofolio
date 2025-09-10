import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { EGender } from '@repo/services';

import { type TUser, ERole, EStatus } from '@repo/business';

import Form from './Form';

describe('<Form/>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    const defaultProps = {
        type: 'blank'
    };

    const renderComponent = (props: any = {}) => {
        return render(<Form {...defaultProps} {...props}/>);
    }

    it('should initialize form with default props', () => {
        renderComponent();
    });

    it('should initialize form with type sign-up', () => {
        renderComponent({ type: 'sign-up' });
        expect(screen.getByTestId('ui-form-sign-up')).toBeInTheDocument();
        expect(screen.queryByTestId('ui-form-input-avatar')).not.toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-cpf')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-name')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-email')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-gender')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-whatsapp')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-date_of_birth')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-password')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-password_confirmation')).toBeInTheDocument();
        expect(screen.getByTestId('mocked-ds-button').textContent).toBe('Sign Up');
    });

    it('should initialize form with type sign-in', () => {
        renderComponent({ type: 'sign-in'});
        expect(screen.getByTestId('ui-form-sign-in')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-email')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-password')).toBeInTheDocument();
        expect(screen.getByTestId('mocked-ds-button').textContent).toBe('Sign In');
    });

    it('should initialize form with type update', () => {
        const user: TUser = {
            id: 'eaca4c08-e62d-495a-ae1c-918199da8d52',
            cpf: '49892120450',
            role: ERole.USER,
            name: 'John Doe',
            email: 'john.doe@mail.com',
            status: EStatus.ACTIVE,
            gender: EGender.MALE,
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHN5dygQnJFirBww40JLAsLuZHF0kOdBrzLw&s',
            password: '$2a$10$5pv7wQmv3rnXyB9YMqgocOAicud4eH9FQcN8beudNS9WMb.sSE5WS',
            whatsapp: '11998765432',
            created_at: new Date('2024-09-09T00:00:00.000Z'),
            updated_at: new Date('2024-09-09T00:00:00.000Z'),
            date_of_birth: new Date('1990-01-01T00:00:00.000Z'),
        };
        renderComponent({ type: 'update', user: { ...user, name: undefined } as unknown as TUser });
        expect(screen.getByTestId('ui-form-update')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-avatar')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-cpf')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-name')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-email')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-gender')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-whatsapp')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-date_of_birth')).toBeInTheDocument();
        expect(screen.getByTestId('mocked-ds-button').textContent).toBe('Save');
    });

    it('should initialize form with type forgot-password', () => {
        renderComponent({ type: 'forgot-password'});
        expect(screen.getByTestId('ui-form-forgot-password')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-email')).toBeInTheDocument();
        expect(screen.getByTestId('mocked-ds-button').textContent).toBe('Send');
    });

    it('should initialize form with type reset-password', () => {
        renderComponent({ type: 'reset-password'});
        expect(screen.getByTestId('ui-form-reset-password')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-password')).toBeInTheDocument();
        expect(screen.getByTestId('ui-form-input-password_confirmation')).toBeInTheDocument();
        expect(screen.getByTestId('mocked-ds-button').textContent).toBe('Send');
    });

    it('should execute submit when button is clicked', () => {
        const onSubmitMock = jest.fn();
        renderComponent({ type: 'sign-in', onSubmit: onSubmitMock });
        const button = screen.getByTestId('mocked-ds-button');
        button.click();
        expect(onSubmitMock).toHaveBeenCalled();
    });

    it('should execute submit when button is clicked and type is sign-up', () => {
        const onSubmitMock = jest.fn();
        renderComponent({ type: 'sign-up', onSubmit: onSubmitMock });

        const inputCpf = screen.getByTestId('ui-form-input-cpf-field');
        fireEvent.input(inputCpf, { target: { name: 'cpf', value: '498.921.204-50' } });

        const inputName = screen.getByTestId('ui-form-input-name-field');
        fireEvent.input(inputName, { target: { name: 'name', value: 'John Doe' } });

        const inputEmail = screen.getByTestId('ui-form-input-email-field');
        fireEvent.input(inputEmail, { target: { name: 'email', value: 'mail@mail.com'} });

        const inputGender = screen.getByTestId('ui-form-input-gender-field');
        fireEvent.input(inputGender, { target: { name: 'gender', value: 'MALE'} });

        const inputWhatsapp = screen.getByTestId('ui-form-input-whatsapp-field');
        fireEvent.input(inputWhatsapp, { target: { name: 'whatsapp', value: '(61) 99876-5432'} });

        const inputPassword = screen.getByTestId('ui-form-input-password-field');
        fireEvent.input(inputPassword, { target: { name: 'password', value: '@Password1'} });

        const inputDateOfBirth = screen.getByTestId('ui-form-input-date_of_birth-field');
        fireEvent.input(inputDateOfBirth, { target: { name: 'date_of_birth', value: '1990-07-20' } });

        const inputPasswordConfirmation = screen.getByTestId('ui-form-input-password_confirmation-field');
        fireEvent.input(inputPasswordConfirmation, { target: { name: 'password_confirmation', value: '@Password1'} });
        
        const button = screen.getByTestId('mocked-ds-button');
        button.click();
        expect(onSubmitMock).toHaveBeenCalled();
    });

    it('should call onInput if provided.', () => {
        const onInputMock = jest.fn();
        renderComponent({ type: 'sign-in', onInput: onInputMock });
        const input = screen.getByTestId('ui-form-input-email-field')
        fireEvent.input(input, { target: { value: 'mail@mail.com' } });
        expect((input as HTMLInputElement).value).toBe('');
    });
})