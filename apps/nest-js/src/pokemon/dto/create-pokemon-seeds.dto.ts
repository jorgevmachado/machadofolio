import { IsBoolean, IsOptional } from 'class-validator';

export class CreatePokemonSeedsDto {
    @IsBoolean()
    @IsOptional()
    move?: boolean;

    @IsBoolean()
    @IsOptional()
    type?: boolean;

    @IsBoolean()
    @IsOptional()
    ability?: boolean;

    @IsBoolean()
    @IsOptional()
    pokemon?: boolean;
}