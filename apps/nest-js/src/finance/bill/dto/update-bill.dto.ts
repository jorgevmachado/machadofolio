import { IsEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import { Expense } from '../../entities/expense.entity';

import { CreateBillDto } from './create-bill.dto';

export class UpdateBillDto extends PartialType(CreateBillDto) {
    @IsEmpty()
    expenses?: Array<string | Expense>;
}
