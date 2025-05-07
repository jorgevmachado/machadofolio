import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Service } from '../../../shared';

import { SupplierType } from './entities/type.entity';

@Injectable()
export class SupplierTypeService extends Service<SupplierType> {
  constructor(
      @InjectRepository(SupplierType)
      protected repository: Repository<SupplierType>,
  ) {
    super('supplier_types', [], repository);
  }
}
