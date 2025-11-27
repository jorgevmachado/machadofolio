import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { CreateSeedDto } from './dto/create-seed.dto';

import { AppService } from './app.service';
import { OptionalAuthGuard } from './guards/optional-auth/optional-auth.guard';

@Controller()
@UseGuards(OptionalAuthGuard)
export class AppController {
    constructor(private readonly service: AppService) {}

    @Post('generate-seeds')
    generateSeeds(@Body() body: CreateSeedDto) {
        return this.service.generateSeeds(body);
    }

    @Post('persist-seeds')
    persistSeeds(@Body() body: CreateSeedDto) {
        return this.service.persistSeeds(body);
    }
}