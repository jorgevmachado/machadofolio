import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IncomeSource as IncomeSourceConstructor } from '@repo/business';

import { Service } from '../../../shared';

import { IncomeSource } from '../../entities/income-source.entity';

import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { FinanceSeederParams } from '../../types';

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
}
