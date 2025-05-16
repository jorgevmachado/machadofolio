import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { QueryParameters } from '@repo/business/types';

import { AuthRoleGuard } from '../../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../../guards/auth-status/auth-status.guard';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('finance/bill')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard)
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get('/list/category')
  findAll(@Query() parameters: QueryParameters) {
    return this.service.findAll({ parameters });
  }

  @Post('/category')
  create(@Body() createBillCategoryDto: CreateCategoryDto) {
    return this.service.create(createBillCategoryDto);
  }

  @Get(':param/category')
  findOne(@Param('param') param: string) {
    return this.service.findOne({ value: param });
  }

  @Put(':param/category')
  update(
      @Param('param') param: string,
      @Body() updateBillCategoryDto: UpdateCategoryDto,
  ) {
    return this.service.update(param, updateBillCategoryDto);
  }

  @Delete(':param/category')
  remove(@Param('param') param: string) {
    return this.service.remove(param);
  }
}
