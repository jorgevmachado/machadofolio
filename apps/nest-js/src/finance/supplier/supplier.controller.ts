import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { type QueryParameters } from '@repo/business';

import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';

import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierService } from './supplier.service';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ListParams } from '../../shared';
import { normalize, toSnakeCase } from '@repo/services';

@Controller('finance/supplier')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard)
export class SupplierController {
    constructor(private readonly service: SupplierService) {
    }

    @Get()
    findAll(@Query() parameters: QueryParameters) {
        const filters: ListParams['filters'] = [];
        if(parameters?.['type'] && typeof parameters?.['type'] === 'string') {
            const type =  toSnakeCase(normalize(parameters['type']));
            filters.push({
                value: type,
                param: 'type.name_code',
                relation: true,
                condition: '='
            });
            delete parameters['type'];
        }
        if(parameters?.['name_code'] && typeof parameters?.['name_code'] === 'string') {
            const name_code =  toSnakeCase(normalize(parameters['name_code']));
            filters.push({
                value: name_code,
                param: 'name_code',
                condition: '='
            });
            delete parameters['type'];
        }
        if(parameters?.name) {
            filters.push({
                value: parameters.name,
                param: 'name',
                condition: '='
            })
            delete parameters.name;
        }
        const params: ListParams = { parameters, withRelations: true };

        if(filters.length > 0) {
            params.filters = filters;
        }

        return this.service.findAll(params);
    }

    @Post()
    async create(@Body() { name, type }: CreateSupplierDto) {
        return await this.service.create({ name, type });
    }

    @Get(':param')
    findOne(@Param('param') param: string) {
        return this.service.findOne({ value: param });
    }

    @Put(':param')
    update(
        @Param('param') param: string,
        @Body() updateSupplierDto: UpdateSupplierDto,
    ) {
        return this.service.update(param, updateSupplierDto);
    }

    @Delete(':param')
    remove(@Param('param') param: string) {
        return this.service.remove(param);
    }
}