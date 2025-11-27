import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { type QueryParameters } from '@repo/business';

import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';

import { PokemonTypeService } from './type.service';

@Controller('pokemon')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard)
export class TypeController {
    constructor(private readonly service: PokemonTypeService) {}

    @Get('/list/type')
    findAll(@Query() parameters: QueryParameters) {
        return this.service.findAll({ parameters });
    }

    @Get(':param/type')
    findOne(@Param('param') param: string) {
        return this.service.findOne({ value: param });
    }
}