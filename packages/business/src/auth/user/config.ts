import { cleanFormatter, mobileValidator } from '@repo/services';

export function validateMobile(value?: string, cleanAllFormatter: boolean = true): string {
    const valueToValidate = cleanFormatter(value);
    console.log('# => validateMobile => value => ', value);
    console.log('# => validateMobile => valueToValidate => ', valueToValidate);
    const validatorMessage = mobileValidator({ value: valueToValidate });
    console.log('# => validateMobile => validatorMessage => ', validatorMessage);
    if (!validatorMessage.valid) {
        throw new Error(validatorMessage.message);
    }
    return !cleanAllFormatter ? value : valueToValidate;
}