import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { transformObjectDateAndNulls } from '@repo/services/object/object';

import BankConstructor from '@repo/business/finance/bank/bank';

import { Service } from '../../../shared';

import { Bank } from '../../entities/bank.entity';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Injectable()
export class BankService extends Service<Bank> {
  constructor(
      @InjectRepository(Bank)
      protected repository: Repository<Bank>,
  ) {
    super('banks', [], repository);
  }

  async create({ name }: CreateBankDto) {
    const bank = new BankConstructor({ name });
    return await this.save(bank);
  }

  async update(param: string, { name }: UpdateBankDto) {
    const result = await this.findOne({ value: param, withDeleted: true });
    const bank = new BankConstructor({ ...result, name });
    return this.save(bank);
  }

  async seeds(listJson: Array<unknown>, withReturnSeed: boolean = true) {
    const seeds = listJson.map((item) => transformObjectDateAndNulls<Bank, unknown>(item));
    return this.seeder.entities({
      by: 'name',
      key: 'all',
      label: 'Bank',
      seeds,
      withReturnSeed,
      createdEntityFn: async (item) => item
    })
  }
}
