import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PassportModule } from '@nestjs/passport';

import { Month } from '../entities/month.entity';

import { MonthService } from './month.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Month]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [MonthService],
    exports: [MonthService],
})
export class MonthModule {}
