import { CreateFinanceSeedsDto } from '../finance/dto/create-finance-seeds.dto';
import { CreatePokemonSeedsDto } from '../pokemon/dto/create-pokemon-seeds.dto';

import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';

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