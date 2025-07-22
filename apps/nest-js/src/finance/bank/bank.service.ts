import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Bank as BankConstructor } from '@repo/business';

import { Service } from '../../shared';

import type { FinanceSeederParams } from '../types';

import { Bank } from '../entities/bank.entity';

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

  async seeds({
                bankListJson: seedsJson,
                withReturnSeed = true
              }: FinanceSeederParams) {

    return this.seeder.entities({
      by: 'name',
      key: 'all',
      label: 'Bank',
      seedsJson,
      withReturnSeed,
      createdEntityFn: async (item) => item
    })
  }

    async createToSheet(value?: string) {
      if(!value) {
        throw new NotFoundException(`${this.alias} not found`);
      }

      const item = await this.findOne({ value, withDeleted: true, withThrow: false });

      if(item) {
        return item;
      }

      return this.create({ name: value });
    }
}
