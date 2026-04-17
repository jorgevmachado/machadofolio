import { IsNotEmpty ,IsOptional ,MaxLength } from 'class-validator';

export class InitializeTrainerDto {

  @IsNotEmpty()
  @MaxLength(200)
  pokemon_name!: string;

  @IsOptional()
  @MaxLength(200)
  nickname?: string;
}