import { IsArray, IsBoolean, IsEnum, IsOptional } from 'class-validator';

import { EMonth, ReplaceWordsParam } from '@repo/services';

import { UploadExpenseParams } from '@repo/business';

export class UploadExpenseDto implements UploadExpenseParams {
    @IsOptional()
    @IsBoolean()
    paid?: boolean;

    @IsOptional()
    @IsEnum(EMonth)
    month?: EMonth;

    @IsOptional()
    @IsArray()
    replaceWords?: ReplaceWordsParam;

    @IsOptional()
    @IsArray()
    repeatedWords?: Array<string>;
}