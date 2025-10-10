import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SupplierType as SupplierTypeConstructor } from '@repo/business';

import SUPPLIER_TYPE_LIST_DEVELOPMENT_JSON from '../../../../seeds/development/finance/supplier-types.json';
import SUPPLIER_TYPE_LIST_STAGING_JSON from '../../../../seeds/staging/finance/supplier-types.json';
import SUPPLIER_TYPE_LIST_PRODUCTION_JSON from '../../../../seeds/production/finance/supplier-types.json';

import { Service } from '../../../shared';

import type { FinanceSeederParams } from '../../types';

import { SupplierType } from '../../entities/type.entity';

import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';


@Injectable()
export class SupplierTypeService extends Service<SupplierType> {
  constructor(
      @InjectRepository(SupplierType)
      protected repository: Repository<SupplierType>,
  ) {
    super('supplier_types', [], repository);
  }

    async create({ name }: CreateTypeDto) {
        const supplierType = new SupplierTypeConstructor({ name });
        return await this.save(supplierType);
    }

    async update(param: string, { name }: UpdateTypeDto) {
        const result = await this.findOne({ value: param, withDeleted: true });
        const supplierType = new SupplierTypeConstructor({
            ...result,
            name,
        });
        return this.save(supplierType);
    }

    async remove(param: string) {
        const result = await this.findOne({
            value: param,
            relations: ['suppliers'],
            withDeleted: true,
        }) as SupplierType;

        const suppliers = result?.suppliers?.filter((item) => !item.deleted_at);

        if (suppliers?.length) {
            throw this.error(
                new ConflictException(
                    'You cannot delete the supplier type because it is already in use.',
                ),
            );
        }
        await this.repository.softRemove(result);
        return { message: 'Successfully removed' };
    }

    async seeds({
                    withReturnSeed = true,
                    supplierTypeListJson: seedsJson,
                }: FinanceSeederParams) {

        return this.seeder.entities({
            by: 'name',
            key: 'all',
            label: 'Supplier Type',
            seedsJson,
            withReturnSeed,
            createdEntityFn: async (item) => item
        })
    }

    async createToSheet(value?: string) {
        if(!value || value === '') {
            throw new NotFoundException(`${this.alias} not found`);
        }
        const item = await this.findOne({ value, withDeleted: true, withThrow: false });

        if(item) {
            return item;
        }

        return this.create({ name: value });
    }

    async generateSeeds(financeSeedsDir: string) {
      const supplierTypes = await this.findAll({ withDeleted: true }) as Array<SupplierType>;
      const listJson = this.getListJson<SupplierType>({
          staging: SUPPLIER_TYPE_LIST_STAGING_JSON,
          production: SUPPLIER_TYPE_LIST_PRODUCTION_JSON,
          development: SUPPLIER_TYPE_LIST_DEVELOPMENT_JSON,
      });
      const added = supplierTypes.filter((item) => !listJson.find((json) => json.id === item.id || json.name === item.name || json.name_code === item.name_code));
      const list = [...listJson, ...added];

      if(added.length > 0) {
          this.file.writeFile('supplier-types.json', financeSeedsDir, list);
      }
      return  {
          list,
          added
      }
    }
}
