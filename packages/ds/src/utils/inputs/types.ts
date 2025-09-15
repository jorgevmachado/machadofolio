export type TInputType = 'cpf' |'text' | 'money' | 'radio' | 'file' | 'number' | 'email' | 'date' | 'phone' | 'textarea' | 'select' | 'password' | 'radio-group';

export type ValidatedProps = {
    invalid: boolean;
    message?: string;
}

export type OptionsProps = {
    label: string;
    value: string;
}

export type TAppearance = 'standard' | 'range';