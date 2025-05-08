import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetUserAuth } from '../decorators/auth-user/auth-user.decorator';
import { User } from '../entities/user.entity';

import { AuthRoleGuard } from '../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../guards/auth-status/auth-status.guard';

import { FinanceService } from './finance.service';

@Controller('finance')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard)
export class FinanceController {
  constructor(private readonly service: FinanceService) {}

  @Post('/initialize')
  initialize(@GetUserAuth() user: User) {
    return this.service.initialize(user);
  }
}
