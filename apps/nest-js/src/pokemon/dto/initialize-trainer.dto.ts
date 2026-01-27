import { IsNotEmpty ,MaxLength } from 'class-validator';

export class InitializeTrainerDto {

  @IsNotEmpty()
  @MaxLength(200)
  pokemon_name!: string;
}