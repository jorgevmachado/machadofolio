import { registerDecorator,type ValidationArguments, type ValidationOptions } from 'class-validator';

export function IsNameDependingOnParent(validationOptions?: ValidationOptions) {
    return function(object: object, propertyName: string) {
        registerDecorator({
            name: 'isNameDependingOnParent',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const obj = args.object as any;

                    if (obj.parent !== undefined && obj.parent !== null && obj.parent !== '') {
                        return value !== undefined && value !== null && value !== '';
                    }

                    return value === undefined || value === null || value === '';
                },
                defaultMessage(args: ValidationArguments): string {
                    const obj = args.object as any;
                    if (obj.parent !== undefined && obj.parent !== null && obj.parent !== '') {
                        return 'The name field is mandatory when parent is present!';
                    }
                    return 'The name field cannot be filled when parent is absent!';
                }

            }
        })
    }
}
