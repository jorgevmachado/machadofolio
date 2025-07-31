export type TInputType = 'cpf' |'text' | 'file' | 'number' | 'email' | 'date' | 'phone' | 'textarea' | 'password';

export type ValidatedProps = {
    invalid: boolean;
    message?: string;
}