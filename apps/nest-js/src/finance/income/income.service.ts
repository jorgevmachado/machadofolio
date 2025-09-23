import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Income as IncomeConstructor } from '@repo/business';

import { type FilterParams, Service } from '../../shared';

import type { FinanceSeederParams } from '../types';
import { Income } from '../entities/incomes.entity';
import { IncomeSource } from '../entities/income-source.entity';
import { Finance } from '../entities/finance.entity';

import { IncomeSourceService } from './source/source.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { MonthService, type CreateByIncomeParams } from '../month/month.service';

type IncomeSeederParams = FinanceSeederParams & {
    finance: Finance;
}

type createToSheetParams = Record<string, string | number | boolean | object | Finance | IncomeSource>;

type SaveCreateIncomeParams = Omit<CreateByIncomeParams, 'isCreate'>

@Injectable()
export class IncomeService extends Service<Income> {
    constructor(
        @InjectRepository(Income)
        protected repository: Repository<Income>,
        protected sourceService: IncomeSourceService,
        protected monthService: MonthService,
    ) {
        super('incomes', ['source', 'months'], repository);
    }

    get source(): IncomeSourceService {
        return this.sourceService;
    }

    private async existIncomeCreated(name_code: string, year: number): Promise<Income | undefined> {
        const filters: Array<FilterParams> = [
            {
                value: name_code,
                param: `${this.alias}.name_code`,
                relation: true,
                condition: 'LIKE',
            },
            {
                value: year,
                param: `${this.alias}.year`,
                relation: true,
                condition: '=',
            }
        ];
        const result = (await this.findAll({ filters, withRelations: true })) as Array<Income>;
        return result[0];
    }

    private async saveCreateIncome({
        value,
        month,
        income,
        received_at,
        monthsToCreate
    }: SaveCreateIncomeParams) {
        try {
            const existingIncome = await this.existIncomeCreated(income.name_code, income.year);
            if (!existingIncome) {
                const savedIncome = await this.save(income) as Income;
                savedIncome.months = await this.monthService.createByIncome(income, true, value, month, monthsToCreate, received_at);
                const total = savedIncome.months.reduce((acc, item) => acc + item.value, 0);
                return await this.save({...savedIncome, total});
            }
            existingIncome.months = await this.monthService.createByIncome(existingIncome, false, value, month, monthsToCreate, received_at);
            const total = existingIncome.months.reduce((acc, item) => acc + item.value, 0);
            return await this.save({...existingIncome, total});
        } catch (error) {
            throw this.error(error);
        }
    }

    async create(finance: Finance, body: CreateIncomeDto) {
        const { year, name, month, months, total: value = 0, source, received_at, description } = body;
        const incomeSource =
            await this.sourceService.treatEntityParam<IncomeSource>(
                source,
                'Income Source',
            ) as IncomeSource;

        const income = new IncomeConstructor({
            name,
            year,
            total: 0,
            source: incomeSource,
            finance,
            description
        });
        return await this.saveCreateIncome({ income, value, month, received_at, monthsToCreate: months });
    }

    async update(finance: Finance, param: string, body: UpdateIncomeDto) {
        const { year, name, source, months, description } = body;
        const result = await this.findOne({ value: param, withRelations: true }) as Income;
        const incomeSource = !source
            ? result.source
            : await this.sourceService.treatEntityParam<IncomeSource>(
                source,
                'Income Source',
            ) as IncomeSource;
        const currentMonths = !months ? result.months :  await this.monthService.updateByIncome(result, months);

        const total = currentMonths?.reduce((acc, item) => acc + item.value, 0) ?? 0;
        const income = new IncomeConstructor({
            ...result,
            name: !name ? result.name : name,
            year: !year ? result.year : year,
            total,
            months: currentMonths,
            source: incomeSource,
            finance,
            description: !description ? result.description : description,
        });
        return await this.save(income);
    }

    async remove(param: string, filters?: Array<FilterParams>) {
        const result = await this.findOne({
            value: param,
            filters,
            withThrow: true,
            withDeleted: true,
            withRelations: true,
        }) as Income;

        if(result?.months?.length) {
            await this.monthService.removeByIncome(result);
        }

        await this.repository.softRemove(result);

        return { message: 'Successfully removed' };
    }

    async seeds({
                    finance,
                    incomeListJson: seedsJson,
                    incomeSourceListJson,
                }: IncomeSeederParams) {
        const listSource = (
            (await this.sourceService.seeds({ incomeSourceListJson, withReturnSeed: true })) as Array<IncomeSource>
        ).filter((source): source is IncomeSource => !!source);

        const list = await this.seeder.entities({
            by: 'name',
            key: 'all',
            label: 'Income',
            seedsJson,
            withReturnSeed: true,
            createdEntityFn: async (item) => {
                const source = this.seeder.getRelation<IncomeSource>({
                    key: 'name',
                    list: listSource,
                    param: item?.source?.name,
                    relation: 'IncomeSource',
                });
                return new IncomeConstructor({
                    name: item.name,
                    year: item.year,
                    total: item.total,
                    source,
                    finance,
                    description: item.description
                })
            },
        }) as Array<Income>;

        return {
            incomeList: list,
            incomeSourceList: listSource
        };
    }

    async createToSheet(finance: Finance, params: createToSheetParams) {
        const builtIncome = {
            name: params['name'] || '',
            year: Number(params['year']),
            total: Number(params['total']),
            sourceName: params['source']?.toString() || '',
            finance,
            received_at: params['received_at'],
            description: 'Generated by a spreadsheet.',
        }

        const item = await this.findOne({
            value: builtIncome.name as string,
            withDeleted: true,
            withThrow: false
        });

        if (item) {
            return item;
        }

        const source = await this.sourceService.createToSheet(builtIncome.sourceName || 'Unknown') as IncomeSource;

        return this.create(finance, {
            name: builtIncome.name as string,
            year: builtIncome.year,
            total: builtIncome.total,
            source,
            received_at: builtIncome.received_at ? new Date(builtIncome?.received_at as string) : new Date(),
            description: builtIncome.description,
        });
    }
}
