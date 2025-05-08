import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Service } from '../../shared';

import { Bank } from '../entities/bank.entity';

@Injectable()
export class BankService  extends Service<Bank> {
  constructor(
      @InjectRepository(Bank)
      protected repository: Repository<Bank>,
  ) {
    super('banks', [], repository);
  }

}
