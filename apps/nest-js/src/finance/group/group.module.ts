import { Group } from '../entities/group.entity';

import { GroupController } from './group.controller';
import { GroupService } from './group.service';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
