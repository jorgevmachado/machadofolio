import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { EMonth, type ReplaceWordParam } from '@repo/services';

import { UploadExpenseParams } from '@repo/business';

class ReplaceWordItemDTO implements ReplaceWordParam {
    @IsString()
    after!: string;

    @IsString()
    before!: string;
}

export class UploadExpenseDto implements UploadExpenseParams {
    file: string = '';

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
        if(value && typeof value === 'string') {
            return value === 'true';
        }
        return value;
    })
    paid?: boolean;

    @IsOptional()
    @IsEnum(EMonth)
    month?: EMonth;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReplaceWordItemDTO)
    @Transform(({ value }) => {
        if(value && ((value) as Array<string>).length === 1) {
            const currentValue = value[0];
            if(typeof currentValue !== 'string') {
                return value;
            }
            const parsed = JSON.parse(`[${currentValue}]`);
            return parsed.map((item: any) => Object.assign(new ReplaceWordItemDTO(), item));
        }

        return value;
    }, { toClassOnly: true })
    replaceWords?: Array<ReplaceWordItemDTO>;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        if(value && ((value) as Array<string>).length === 1) {
            console.log('# => repeatedWords => ', value);
            return value[0].split(',');
        }
        return value;
    })
    repeatedWords?: Array<string>;
}