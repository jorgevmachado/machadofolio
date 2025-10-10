import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Bank as BankConstructor } from '@repo/business';

import BANK_LIST_DEVELOPMENT_JSON from '../../../seeds/development/finance/banks.json';
import BANK_LIST_STAGING_JSON from '../../../seeds/staging/finance/banks.json';
import BANK_LIST_PRODUCTION_JSON from '../../../seeds/production/finance/banks.json';

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

    async generateSeeds(financeSeedsDir: string) {
      const banks = await this.findAll({ withDeleted: true }) as Array<Bank>;
      const listJson = this.getListJson<Bank>({
            staging: BANK_LIST_STAGING_JSON,
            production: BANK_LIST_PRODUCTION_JSON,
            development: BANK_LIST_DEVELOPMENT_JSON,
      });

      const added = banks.filter((bank) => {
          return !listJson.find((json) => json.name === bank.name || json.name_code === bank.name_code);
      });

      const list = [...listJson, ...added];

      if(added.length > 0) {
          this.file.writeFile('banks.json', financeSeedsDir, list);
      }

      return {
          list,
          added,
      };
    }
}
