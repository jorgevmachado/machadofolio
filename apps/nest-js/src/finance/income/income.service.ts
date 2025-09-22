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
import { MonthService } from '../month/month.service';

type IncomeSeederParams = FinanceSeederParams & {
    finance: Finance;
}

type createToSheetParams = Record<string, string | number | boolean | object | Finance | IncomeSource>;

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

    private async persist(income: Income) {
        try {
            const existingIncome = await this.existIncomeCreated(income.name_code, income.year);
            if (!existingIncome) {
                const savedIncome = await this.save(income) as Income;
                savedIncome.months = await this.monthService.createByIncome(income);
                return await this.save(savedIncome);
            }
            existingIncome.months = await this.monthService.updateByIncome(existingIncome, income.months);
            return await this.save(existingIncome);
        } catch (error) {
            throw this.error(error);
        }
    }

    async create(finance: Finance, body: CreateIncomeDto) {
        const { year, name, month, months, total, source, received_at, description } = body;
        const incomeSource =
            await this.sourceService.treatEntityParam<IncomeSource>(
                source,
                'Income Source',
            ) as IncomeSource;

        const currentMonths = this.monthService.treatMonths(year, month, months, total, received_at);
        const currentTotal = currentMonths?.reduce((acc, item) => acc + item.value, 0);
        const income = new IncomeConstructor({
            name,
            year,
            total: currentTotal,
            months: currentMonths,
            source: incomeSource,
            finance,
            description
        });
        return await this.persist(income);
    }

    async update(finance: Finance, param: string, body: UpdateIncomeDto) {
        const { year, name, total, source, description } = body;
        const result = await this.findOne({ value: param }) as Income;
        const incomeSource = !source
            ? result.source
            : await this.sourceService.treatEntityParam<IncomeSource>(
                source,
                'Income Source',
            ) as IncomeSource;

        const income = new IncomeConstructor({
            name: !name ? result.name : name,
            year: !year ? result.year : year,
            total: !total ? result.total : total,
            source: incomeSource,
            finance,
            description: !description ? result.description : description,
        });
        return await this.save(income);
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
