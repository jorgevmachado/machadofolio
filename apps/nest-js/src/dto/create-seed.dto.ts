import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateFinanceSeedsDto } from '../finance/dto/create-finance-seeds.dto';
import { CreatePokemonSeedsDto } from '../pokemon/dto/create-pokemon-seeds.dto';

export class CreateSeedDto {
    @IsBoolean()
    @IsOptional()
    auth?: boolean;

    @ValidateNested()
    @IsOptional()
    @Type(() => CreateFinanceSeedsDto)
    finance?: CreateFinanceSeedsDto;

    @ValidateNested()
    @IsOptional()
    @Type(() => CreatePokemonSeedsDto)
    pokemon?: CreatePokemonSeedsDto;
}