import { IsNotEmpty, MaxLength } from 'class-validator';

export class BattleDto {

  @IsNotEmpty()
  @MaxLength(200)
  pokemon!: string;

  @IsNotEmpty()
  @MaxLength(200)
  pokemon_move!: string;

  @IsNotEmpty()
  @MaxLength(200)
  wild_pokemon!: string;
}