import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supplier as SupplierConstructor } from '@repo/business';

import SUPPLIER_LIST_DEVELOPMENT_JSON from '../../../seeds/development/finance/suppliers.json';
import SUPPLIER_LIST_STAGING_JSON from '../../../seeds/staging/finance/suppliers.json';
import SUPPLIER_LIST_PRODUCTION_JSON from '../../../seeds/production/finance/suppliers.json';

import { ListParams, Service } from '../../shared';

import type { FinanceSeederParams } from '../types';

import { Supplier } from '../entities/supplier.entity';
import { SupplierType } from '../entities/type.entity';

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

    get type(): SupplierTypeService {
        return this.supplierTypeService;
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
            ...result,
            name: currentName,
            type: supplierType,
        });
        return await this.save(supplier);
    }

    async remove(param: string, filters: ListParams['filters'] = [], withDeleted: boolean = false) {
        const result = await this.findOne({
            value: param,
            filters,
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
                    supplierListJson: seedsJson,
                    supplierTypeListJson,
                }: FinanceSeederParams) {
      const listType = (
          (await this.supplierTypeService.seeds({ supplierTypeListJson, withReturnSeed: true})) as Array<SupplierType>
      ).filter((type): type is SupplierType => !!type);

        const list = await this.seeder.entities({
            by: 'name',
            key: 'all',
            label: 'Supplier',
            seedsJson,
            withReturnSeed: true,
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
        }) as Array<Supplier>;

        return {
            supplierList: list,
            supplierTypeList: listType
        };
    }

    async createToSheet(value?: string) {
        if(!value || value === '') {
            throw new NotFoundException(`${this.alias} not found`);
        }
        const item = await this.findOne({ value, withDeleted: true, withThrow: false });

        if(item) {
            return item;
        }

        const supplierType = await this.supplierTypeService.createToSheet('Unknown') as SupplierType;

        return this.create({ name: value, type: supplierType });
    }

    async generateSeeds(withSupplierType: boolean, withSupplier: boolean, financeSeedsDir: string) {
        const supplierTypes = (!withSupplierType && !withSupplier) ? { list: [], added: []} : await this.supplierTypeService.generateSeeds(financeSeedsDir);
        const suppliers = !withSupplier ? [] : await this.findAll({ withRelations: true, withDeleted: true }) as Array<Supplier>;
        const listJson = this.getListJson<Supplier>({
            staging: SUPPLIER_LIST_STAGING_JSON,
            production: SUPPLIER_LIST_PRODUCTION_JSON,
            development: SUPPLIER_LIST_DEVELOPMENT_JSON,
        });
        const added = suppliers.filter((item) => !listJson.find((json) => json.id === item.id || json.name === item.name || json.name_code === item.name_code));
        const list = [...listJson, ...added];
        if(added.length > 0) {
            this.file.writeFile('suppliers.json', financeSeedsDir, list);
        }

        return {
            suppliers: {
                list,
                added,
            },
            supplierTypes
        }
    }
}
