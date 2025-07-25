export type TInputType = 'text' | 'file' | 'number' | 'email' | 'date' | 'phone' | 'textarea' | 'password';

export type ValidatorProps = {
    invalid: boolean;
    message?: string;
}