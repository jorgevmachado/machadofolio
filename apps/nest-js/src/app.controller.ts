import { Body, Controller, Post } from '@nestjs/common';

import { CreateSeedDto } from './dto/create-seed.dto';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {
  }

  @Post('seeds')
  seeds(@Body() body: CreateSeedDto) {
    return this.service.seeds(body);
  }
}
