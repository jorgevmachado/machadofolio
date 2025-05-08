import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { QueryParameters } from '@repo/business/types';

import { CreateTypeDto } from './dto/create-type.dto';
import { SupplierTypeService } from './type.service';
import { UpdateTypeDto } from './dto/update-type.dto';

@Controller('finance/supplier')
export class TypeController {
  constructor(private readonly service: SupplierTypeService) {}

  @Get('/list/type')
  findAll(@Query() parameters: QueryParameters) {
    return this.service.findAll({ parameters });
  }

  @Post('/type')
  async create(@Body() { name }: CreateTypeDto) {
    return await this.service.create({ name });
  }

  @Get(':param/type')
  findOne(@Param('param') param: string) {
    return this.service.findOne({ value: param });
  }

  @Put(':param/type')
  update(
      @Param('param') param: string,
      @Body() updateSupplierTypeDto: UpdateTypeDto,
  ) {
    return this.service.update(param, updateSupplierTypeDto);
  }

  @Delete(':param/type')
  remove(@Param('param') param: string) {
    return this.service.remove(param);
  }
}
