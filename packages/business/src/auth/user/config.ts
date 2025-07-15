import { cleanFormatter, mobileValidator } from '@repo/services';

export function validateMobile(value?: string, cleanAllFormatter: boolean = true): string {
    const valueToValidate = cleanFormatter(value);
    const validatorMessage = mobileValidator({ value: valueToValidate });
    if (!validatorMessage.valid) {
        throw new Error(validatorMessage.message);
    }
    return !cleanAllFormatter ? value : valueToValidate;
}