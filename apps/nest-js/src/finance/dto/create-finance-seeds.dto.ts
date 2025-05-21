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
    expense?: boolean;

    @IsBoolean()
    @IsOptional()
    supplier?: boolean;
}