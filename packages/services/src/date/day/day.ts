import {INVALID_TYPE, REQUIRED_FIELD, type ValidatorMessage, type ValidatorParams} from "../../shared";

export function dayValidator({ value }: ValidatorParams): ValidatorMessage {
    if (!value  && value !== 0) {
        return REQUIRED_FIELD;
    }

    if (typeof value !== 'number') {
        return INVALID_TYPE;
    }

    const valid = value >= 1 && value <= 31;
    return {
        valid,
        value: valid ? value : undefined,
        message: valid ? 'Valid day.' : 'Please enter a valid day.',
    };
}

export function parseDay(value?: string | number): number | undefined {
    if (!value) {
        return;
    }

    const valueNumber = Number(value);

    if (isNaN(valueNumber)) {
        return;
    }

    return dayValidator({ value: valueNumber }).valid ? valueNumber : undefined;
}