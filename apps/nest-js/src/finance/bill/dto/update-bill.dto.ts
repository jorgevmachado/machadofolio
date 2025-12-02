import { IsOptional } from 'class-validator';

import { Expense } from '../../entities/expense.entity';

import { CreateBillDto } from './create-bill.dto';

import { PartialType } from '@nestjs/mapped-types';

export class UpdateBillDto extends PartialType(CreateBillDto) {
    @IsOptional()
    expenses?: Array<string | Expense>;
}
