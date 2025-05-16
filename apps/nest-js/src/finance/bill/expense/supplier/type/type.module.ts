import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SupplierType } from '../../../../entities/type.entity';
import { SupplierTypeService } from './type.service';
import { TypeController } from './type.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplierType]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TypeController],
  providers: [SupplierTypeService],
  exports: [SupplierTypeService],
})
export class TypeModule {}
