import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'Match',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchConstraint,
        });
    };
}

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments) {
        if(!validationArguments) {
            return false;
        }
        const [relatedPropertyName] = validationArguments.constraints;
        const relatedValue = (validationArguments?.object as any)[
            relatedPropertyName
            ];
        return value === relatedValue;
    }

    defaultMessage(validationArguments?: ValidationArguments) {
        return `${validationArguments?.property} and ${validationArguments?.constraints[0]} do not match`;
    }
}
