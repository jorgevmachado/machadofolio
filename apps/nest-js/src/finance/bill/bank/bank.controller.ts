import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { QueryParameters } from '@repo/business/types';

import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Controller('finance/bill')
export class BankController {
  constructor(private readonly service: BankService) {}

  @Get('/list/bank')
  findAll(@Query() parameters: QueryParameters) {
    return this.service.findAll({ parameters });
  }

  @Post('/bank')
  create(@Body() { name }: CreateBankDto) {
    return this.service.create({ name });
  }

  @Get(':param/bank')
  findOne(@Param('param') param: string) {
    return this.service.findOne({ value: param });
  }

  @Put(':param/bank')
  update(@Param('param') param: string, @Body() updateBank: UpdateBankDto) {
    return this.service.update(param, updateBank);
  }

  @Delete(':param/bank')
  remove(@Param('param') param: string) {
    return this.service.remove(param);
  }

}
