import { IsBoolean, IsOptional } from 'class-validator';

export class CreateFinanceSeedsDto {
    @IsBoolean()
    @IsOptional()
    bank?: boolean;

    @IsBoolean()
    @IsOptional()
    bill?: boolean;

    @IsBoolean()
    @IsOptional()
    group?: boolean;

    @IsBoolean()
    @IsOptional()
    income?: boolean;

    @IsBoolean()
    @IsOptional()
    expense?: boolean;

    @IsBoolean()
    @IsOptional()
    supplier?: boolean;

    @IsBoolean()
    @IsOptional()
    finance?: boolean;

    @IsBoolean()
    @IsOptional()
    supplierType?: boolean;

    @IsBoolean()
    @IsOptional()
    incomeSource?: boolean;
}