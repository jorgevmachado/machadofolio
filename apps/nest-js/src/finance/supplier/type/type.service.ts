import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SupplierType as SupplierTypeConstructor } from '@repo/business';

import SUPPLIER_TYPE_LIST_DEVELOPMENT_JSON from '../../../../seeds/development/finance/supplier_types.json';
import SUPPLIER_TYPE_LIST_STAGING_JSON from '../../../../seeds/staging/finance/supplier_types.json';
import SUPPLIER_TYPE_LIST_PRODUCTION_JSON from '../../../../seeds/production/finance/supplier_types.json';

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
        const item = await this.findOne({ value, withRelations: true, withDeleted: true, withThrow: false });

        if(item) {
            return item;
        }

        return this.create({ name: value });
    }

    async generateSeeds(withoutSupplierType: boolean, financeSeedsDir: string) {
        return await this.generateEntitySeeds({
            withSeed: !withoutSupplierType,
            seedsDir: financeSeedsDir,
            staging: SUPPLIER_TYPE_LIST_STAGING_JSON,
            production: SUPPLIER_TYPE_LIST_PRODUCTION_JSON,
            development: SUPPLIER_TYPE_LIST_DEVELOPMENT_JSON,
            filterGenerateEntityFn: (json, item) => json.name === item.name || json.name_code === item.name_code
        });
    }

    async persistSeeds(withoutSupplierType: boolean) {
        return await this.seeder.persistEntity({
            withSeed: !withoutSupplierType,
            staging: SUPPLIER_TYPE_LIST_STAGING_JSON,
            production: SUPPLIER_TYPE_LIST_PRODUCTION_JSON,
            development: SUPPLIER_TYPE_LIST_DEVELOPMENT_JSON,
        });
    }
}