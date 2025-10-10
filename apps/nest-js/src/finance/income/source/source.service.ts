import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IncomeSource as IncomeSourceConstructor } from '@repo/business';

import INCOME_SOURCE_LIST_DEVELOPMENT_JSON from '../../../../seeds/development/finance/income-sources.json';
import INCOME_SOURCE_LIST_STAGING_JSON from '../../../../seeds/staging/finance/income-sources.json';
import INCOME_SOURCE_LIST_PRODUCTION_JSON from '../../../../seeds/production/finance/income-sources.json';

import { GenerateSeeds, Service } from '../../../shared';

import { IncomeSource } from '../../entities/income-source.entity';

import { FinanceSeederParams } from '../../types';

import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';

@Injectable()
export class IncomeSourceService extends Service<IncomeSource>{
    constructor(
        @InjectRepository(IncomeSource)
        protected repository: Repository<IncomeSource>,
    ) {
        super('income_sources', [], repository);
    }

    async create({ name }: CreateSourceDto) {
        const incomeSource = new IncomeSourceConstructor({ name });
        return await this.save(incomeSource);
    }

    async update(param: string, { name }: UpdateSourceDto) {
        const result = await this.findOne({ value: param, withDeleted: true });
        const incomeSource = new IncomeSourceConstructor({ ...result, name });
        return await this.save(incomeSource);
    }

    async remove(param: string) {
        const result = await this.findOne({
            value: param,
            relations: ['incomes'],
            withDeleted: true,
        }) as IncomeSource;

        const incomes = result?.incomes?.filter((item) => !item.deleted_at);

        if(incomes?.length) {
            throw this.error(
                new Error(
                    'You cannot delete the income source because it is already in use.',
                ),
            );
        }
        await this.repository.softRemove(result);
        return { message: 'Successfully removed' };
    }

    async seeds({
            withReturnSeed = true,
           incomeSourceListJson: seedsJson
    }: FinanceSeederParams) {
        return this.seeder.entities({
            by: 'name',
            key: 'all',
            label: 'Income Source',
            seedsJson,
            withReturnSeed,
            createdEntityFn: async (item) => item
        });
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

    async generateSeeds(returnEmpty: boolean, financeSeedsDir: string): Promise<GenerateSeeds<IncomeSource>> {
        if(returnEmpty) {
            return {
                list: [],
                added: []
            };
        }
        const incomeSources = await this.findAll({ withDeleted: true }) as Array<IncomeSource>;
        const listJson = this.getListJson<IncomeSource>({
            staging: INCOME_SOURCE_LIST_STAGING_JSON,
            production: INCOME_SOURCE_LIST_PRODUCTION_JSON,
            development: INCOME_SOURCE_LIST_DEVELOPMENT_JSON,
        });
        const added = incomeSources.filter((item) => !listJson.find((json) => json.id === item.id || json.name === item.name || json.name_code === item.name_code));
        const list = [...listJson, ...added];

        if(added.length > 0) {
            this.file.writeFile('income-sources.json', financeSeedsDir, list);
        }

        return {
            list,
            added
        }
    }
}
