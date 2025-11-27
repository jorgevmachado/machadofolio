import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { type QueryParameters } from '@repo/business';

import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';

import {  PokemonMoveService } from './move.service';

@Controller('pokemon')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard)
export class MoveController {
    constructor(private readonly service: PokemonMoveService) {}

    @Get('/list/move')
    findAll(@Query() parameters: QueryParameters) {
        return this.service.findAll({ parameters });
    }

    @Get(':param/move')
    findOne(@Param('param') param: string) {
        return this.service.findOne({ value: param });
    }
}