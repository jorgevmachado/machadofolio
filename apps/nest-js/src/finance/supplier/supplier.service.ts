import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Service } from '../../shared';

import { Supplier } from '../entities/supplier.entity';
import { SupplierTypeService } from './type/type.service';

@Injectable()
export class SupplierService extends Service<Supplier> {
  constructor(
      @InjectRepository(Supplier)
      protected repository: Repository<Supplier>,
      protected supplierTypeService: SupplierTypeService,
  ) {
    super('suppliers', ['type'], repository);
  }
}
