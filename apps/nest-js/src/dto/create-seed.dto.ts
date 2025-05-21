import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { CreateFinanceSeedsDto } from '../finance/dto/create-finance-seeds.dto';
import { Type } from 'class-transformer';

export class CreateSeedDto {

    @IsBoolean()
    @IsOptional()
    auth?: boolean;

    @ValidateNested()
    @IsOptional()
    @Type(() => CreateFinanceSeedsDto)
    finance?: CreateFinanceSeedsDto;

    @IsBoolean()
    @IsOptional()
    pokemon?: boolean;
}