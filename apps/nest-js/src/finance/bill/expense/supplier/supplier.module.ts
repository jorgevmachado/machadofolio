import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Supplier } from '../../../../entities/supplier.entity';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { TypeModule } from './type/type.module';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService],
  imports: [
      TypeOrmModule.forFeature([Supplier]),
      PassportModule.register({ defaultStrategy: 'jwt' }),
      TypeModule
  ],
  exports: [SupplierService]
})
export class SupplierModule {}
