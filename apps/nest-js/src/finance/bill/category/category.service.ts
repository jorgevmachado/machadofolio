import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Service } from '../../../shared';

import { BillCategory } from '../../entities/category.entity';

@Injectable()
export class CategoryService extends Service<BillCategory> {
  constructor(
      @InjectRepository(BillCategory)
      protected repository: Repository<BillCategory>,
  ) {
    super('bill_categories', [], repository);
  }
}
