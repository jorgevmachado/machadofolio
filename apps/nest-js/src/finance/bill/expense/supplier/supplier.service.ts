import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { transformObjectDateAndNulls } from '@repo/services/object/object';

import SupplierConstructor from '@repo/business/finance/supplier/supplier';

import { Service } from '../../../../shared';

import type { FinanceSeederParams } from '../../../types';

import { Supplier } from '../../../entities/supplier.entity';
import { SupplierType } from '../../../entities/type.entity';

import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierTypeService } from './type/type.service';
import { UpdateSupplierDto } from './dto/update-supplier.dto';


@Injectable()
export class SupplierService extends Service<Supplier> {
  constructor(
      @InjectRepository(Supplier)
      protected repository: Repository<Supplier>,
      protected supplierTypeService: SupplierTypeService,
  ) {
    super('suppliers', ['type'], repository);
  }

    async create({ name, type }: CreateSupplierDto) {
        const supplierType =
            await this.supplierTypeService.treatEntityParam<SupplierType>(
                type,
                'Supplier Type',
            ) as SupplierType;
        const supplier = new SupplierConstructor({
            name,
            type: supplierType,
        });
        return await this.save(supplier);
    }

    async update(param: string, { name, type }: UpdateSupplierDto) {
        const result = await this.findOne({ value: param }) as Supplier;
        const supplierType = !type
            ? result.type
            : await this.supplierTypeService.treatEntityParam<SupplierType>(
                type,
                'Supplier Type',
            ) as SupplierType;
        const currentName = !name ? result.name : name;
        const supplier = new SupplierConstructor({
            name: currentName,
            type: supplierType,
        });
        return await this.save(supplier);
    }

    async remove(param: string, withDeleted: boolean = false) {
        const result = await this.findOne({
            value: param,
            relations: ['expenses'],
            withDeleted,
        }) as Supplier;
        if (result?.expenses?.length) {
            throw this.error(
                new ConflictException(
                    'You cannot delete the supplier because it is already in use.',
                ),
            );
        }
        await this.repository.softRemove(result);
        return { message: 'Successfully removed' };
    }

    async seeds({
                    withReturnSeed = true,
                    supplierListJson: listJson,
                    supplierTypeListJson,
                }: FinanceSeederParams) {
      const listType = (
          (await this.supplierTypeService.seeds({ supplierTypeListJson, withReturnSeed})) as Array<SupplierType>
      ).filter((type): type is SupplierType => !!type);

        if(!listJson) {
            return [];
        }
        const seeds = listJson.map((item) => transformObjectDateAndNulls<Supplier, unknown>(item));

        return this.seeder.entities({
            by: 'name',
            key: 'all',
            label: 'Supplier',
            seeds,
            withReturnSeed,
            createdEntityFn: async (item) => {
                const type = this.seeder.getRelation<SupplierType>({
                    key: 'name',
                    list: listType,
                    param: item?.type?.name,
                    relation: 'SupplierType',
                });
                return new SupplierConstructor({
                    name: item.name,
                    type
                })
            },
        })
    }
}
