import { INVALID_TYPE, REQUIRED_FIELD, type ValidatorMessage, type ValidatorParams } from '../shared';

export function cepFormatter(value?: string): string {
    if (!value) {
        return '';
    }
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{5})(\d{3})+$/, '$1-$2')
        .replace(/(-d{3})(\d+?)/, '$1');
}

export function cepValidator({ value }: ValidatorParams): ValidatorMessage {
    if (!value) {
        return REQUIRED_FIELD;
    }

    if (typeof value !== 'string') {
        return INVALID_TYPE;
    }

    const hasMask = value.includes('-');
    const regex = hasMask ? /^\d{2}\d{3}-\d{3}$/ : /^\d{5}\d{3}$/;
    const valid = regex.test(value);
    return {
        valid,
        value: valid ? value : undefined,
        message: valid ? 'Valid zip code.' : 'Please enter a valid cep.',
    };
}