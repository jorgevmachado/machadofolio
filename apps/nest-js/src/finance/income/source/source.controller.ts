import { QueryParameters } from '@repo/business';

import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { IncomeSourceService } from './source.service';

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

@Controller('finance/income')
export class SourceController {
  constructor(private readonly service: IncomeSourceService) {}

    @Get('/list/source')
    findAll(@Query() parameters: QueryParameters) {
      return this.service.findAll({ parameters });
    }

    @Post('/source')
    async create(@Body() { name }: CreateSourceDto) {
      return await this.service.create({ name });
    }

    @Get(':param/source')
    async findOne(@Param('param') param: string) {
        return await this.service.findOne({ value: param });
    }

    @Put(':param/source')
    async update(
        @Param('param') param: string,
        @Body() update: UpdateSourceDto) {
        return await this.service.update(param, update);
    }

    @Delete(':param/source')
    async remove(@Param('param') param: string) {
        return await this.service.remove(param);
    }
}
