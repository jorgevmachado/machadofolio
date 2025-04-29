import {INVALID_TYPE, REQUIRED_FIELD, ValidatorMessage, ValidatorParams} from "../../shared";

export function yearValidator({ value, min = 1, max = 9999 }: ValidatorParams): ValidatorMessage {
    if (!value) {
        return REQUIRED_FIELD;
    }

    if (typeof value !== 'number') {
        return INVALID_TYPE;
    }

    const valid = value >= min && value <= max;
    return {
        valid,
        value: valid ? value : undefined,
        message: valid ? 'Valid year.' : 'Please enter a valid year.',
    };
}

export function parseYear(value?: string | number): number | undefined {
    if (!value && value !== 0) {
        return;
    }

    const valueNumber = Number(value);

    if (isNaN(valueNumber)) {
        return;
    }

    return yearValidator({ value: valueNumber, min: 1000 }).valid
        ? valueNumber
        : undefined;
}