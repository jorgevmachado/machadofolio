import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthRoleGuard } from '../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../guards/auth-status/auth-status.guard';
import { GetUserAuth } from '../decorators/auth-user/auth-user.decorator';
import { User } from '../auth/entities/user.entity';

import { FinanceService } from './finance.service';

@Controller('finance')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard)
export class FinanceController {
    constructor(private readonly service: FinanceService) {
    }

    @Get()
    find(@GetUserAuth() user: User) {
        return this.service.getByUser(user);
    }

    @Post()
    create(@GetUserAuth() user: User) {
        return this.service.create(user);
    }
}