export type ValidatorMessage = {
    value?: string | Date | number | boolean;
    valid: boolean;
    accept?: string;
    message: string;
}

export type ValidatorParams = Pick<ValidatorMessage, 'value'>  & {
    min?: number;
    max?: number;
    accept?: string;
    optionalValue?: string | Date;
}