import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}
