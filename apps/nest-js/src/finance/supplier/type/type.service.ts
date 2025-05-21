import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import SupplierTypeConstructor from '@repo/business/finance/supplier-type/supplier-type';

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
}
