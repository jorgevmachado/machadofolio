import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonthBusiness } from '@repo/business';

import { Month } from '../entities/month.entity';

import { MonthService } from './month.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Month]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [MonthService, MonthBusiness],
    exports: [MonthService],
})
export class MonthModule {}
