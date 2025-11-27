import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

import { EMonth, type ReplaceWordParam } from '@repo/services';
import { Transform, Type } from 'class-transformer';

class ReplaceWordItemDTO implements ReplaceWordParam {
    @IsString()
    after!: string;

    @IsString()
    before!: string;
}

export class UploadsExpenseDto {
    @IsOptional()
    @IsArray()
    @IsBoolean({ each: true})
    @Transform(({ value }) => {
        if(value && Array.isArray(value)) {
            if(value.length === 1) {
                const array = value[0].split(',');
                return array.map((item: string) => item.trim() === 'true') as Array<boolean>;
            }
            return value.map((item: string) => item.trim() === 'true') as Array<boolean>;
        }
        return value;
    }, { toClassOnly: true })
    paid?: Array<boolean>;

    files: Array<string> = [];

    @IsOptional()
    @IsArray()
    @IsEnum(EMonth, { each: true })
    @Transform(({ value }) => {
        if(value && ((value) as Array<string>).length === 1) {
            const array = value[0].split(',');
            return array.map((item: string) => item.trim()) as Array<EMonth>;
        }
        return value;
    }, { toClassOnly: true })
    months?: Array<EMonth>;



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
            return value[0].split(',');
        }
        return value;
    })
    repeatedWords?: Array<string>;
}