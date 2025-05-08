import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBillDto {
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}
