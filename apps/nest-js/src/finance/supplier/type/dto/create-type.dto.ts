import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTypeDto {
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}
