import { cleanFormatter } from '@repo/services/string/string';
import { mobileValidator } from '@repo/services/contact/contact';

export function validateMobile(value?: string, cleanAllFormatter: boolean = true): string {
    const valueToValidate = cleanFormatter(value);
    const validatorMessage = mobileValidator({ value: valueToValidate });
    if (!validatorMessage.valid) {
        throw new Error(validatorMessage.message);
    }
    return !cleanAllFormatter ? value : valueToValidate;
}