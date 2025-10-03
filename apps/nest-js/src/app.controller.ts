import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { CreateSeedDto } from './dto/create-seed.dto';

import { AppService } from './app.service';
import { GetUserAuth } from './decorators/auth-user/auth-user.decorator';
import { User } from './auth/entities/user.entity';
import { OptionalAuthGuard } from './guards/optional-auth/optional-auth.guard';

@Controller()
@UseGuards(OptionalAuthGuard)
export class AppController {
  constructor(private readonly service: AppService) {
  }

  @Post('seeds')
  seeds(@Body() body: CreateSeedDto, @GetUserAuth() user?: User) {
    return this.service.seeds(body, user);
  }
}
