import { Repository } from 'typeorm';

import { Income as IncomeConstructor } from '@repo/business';

import INCOME_LIST_DEVELOPMENT_JSON from '../../../seeds/development/finance/incomes.json';
import INCOME_LIST_PRODUCTION_JSON from '../../../seeds/production/finance/incomes.json';
import INCOME_LIST_STAGING_JSON from '../../../seeds/staging/finance/incomes.json';
import { type FilterParams, SeedsGenerated, Service } from '../../shared';

import { Finance } from '../entities/finance.entity';
import { IncomeSource } from '../entities/income-source.entity';
import { Income } from '../entities/incomes.entity';
import { Month } from '../entities/month.entity';
import { MonthService } from '../month/month.service';
import type { FinanceSeederParams } from '../types';

import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeSourceService } from './source/source.service';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

type IncomeSeederParams = FinanceSeederParams & {
    finance: Finance;
}

type createToSheetParams = Record<string, string | number | boolean | object | Finance | IncomeSource>;

type IncomeGenerateSeeds = {
    months: Array<Month>;
    incomes: SeedsGenerated<Income>;
    incomeSources: SeedsGenerated<IncomeSource>;
}

@Injectable()
export class IncomeService extends Service<Income> {
    constructor(
        @InjectRepository(Income)
        protected repository: Repository<Income>,
        protected sourceService: IncomeSourceService,
        protected monthService: MonthService,
    ) {
        super('incomes', ['source', 'months', 'finance'], repository);
    }

    get source(): IncomeSourceService {
        return this.sourceService;
    }

    private async existIncome(finance: Finance, name_code: string, year: number): Promise<Income | undefined> {
        const filters: Array<FilterParams> = [
            {
                value: finance.id,
                param: `${this.alias}.finance`,
                relation: true,
                condition: '=',
            },
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

    async create(finance: Finance, body: CreateIncomeDto) {
        try {
            const incomeSource =
                await this.sourceService.treatEntityParam<IncomeSource>(
                    body.source,
                    'Income Source',
                ) as IncomeSource;

            const income = new IncomeConstructor({
                name: body.name,
                year: body.year,
                total: 0,
                source: incomeSource,
                finance,
                description: body.description,
            });

            const existingIncome = await this.existIncome(finance, income.name_code, income.year);
            const params = !existingIncome ? income : { ...existingIncome, ...income };
            const savedIncome = await this.save(params) as Income;

            const months = this.monthService.business.generateMonthListCreationParameters({
                year: savedIncome.year,
                paid: body.paid,
                value: body.total,
                received_at: body.received_at ?? savedIncome?.created_at,
                month: body.month,
                months: body.months,
            });

            if (months.length > 0) {
                savedIncome.months = await this.monthService.persistList(months, { income: savedIncome })
                savedIncome.total = savedIncome.months.reduce((acc, item) => acc + item.value, 0);
                return await this.save(savedIncome);
            }
            return savedIncome;
        } catch (error) {
            throw this.error(error);
        }
    }

    async update(finance: Finance, param: string, body: UpdateIncomeDto) {
        try {
            const result = await this.findOne({
                value: param, withRelations: true, filters: [{
                    value: finance.id,
                    param: `${this.alias}.finance`,
                    relation: true,
                    condition: '=',
                }]
            }) as Income;
            const incomeSource = !body?.source
                ? result.source
                : await this.sourceService.treatEntityParam<IncomeSource>(
                    body.source,
                    'Income Source',
                ) as IncomeSource;

            const income = new IncomeConstructor({
                ...result,
                name: body?.name || result.name,
                year: body?.year || result.year,
                source: incomeSource,
                finance,
                description: body?.description || result.description,

            })

            const monthsToPersist = this.monthService.business.generateMonthListUpdateParameters(result.months, body.months);
            if (monthsToPersist && monthsToPersist.length > 0) {
                income.months = await this.monthService.persistList(monthsToPersist, { income });
                income.total = income.months.reduce((acc, item) => acc + item.value, 0);
            }
            return await this.save(income);

        } catch (error) {
            throw this.error(error);
        }
    }

    async remove(param: string, filters?: Array<FilterParams>) {
        const result = await this.findOne({
            value: param,
            filters,
            withThrow: true,
            withDeleted: true,
            withRelations: true,
        }) as Income;

        await this.monthService.removeList({ income: result });

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
                    months: item.months,
                    source,
                    finance,
                    description: item.description
                })
            },
        }) as Array<Income>;
        const incomeList: Array<Income> = []
        const incomes = this.seeder.currentSeeds<Income>({ seedsJson })
        for(const income of list) {
            const currentIncome = incomes?.find((item) => item.name_code === income.name_code);
            if(currentIncome && currentIncome?.months && currentIncome?.months?.length > 0) {
                income.months = await this.monthService.persistList(currentIncome.months, { income });
                income.total = income.months.reduce((acc, item) => acc + item.value, 0);
                const savedIncome = await this.save(income) as Income;
                incomeList.push(savedIncome);
                continue;
            }
            incomeList.push(income);
        }

        return {
            incomeList,
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

    async generateSeeds(withIncomeSource: boolean, withIncome: boolean, financeSeedsDir: string): Promise<IncomeGenerateSeeds> {
        const incomeSources = await this.sourceService.generateSeeds(!withIncomeSource && !withIncome, financeSeedsDir);

        const incomes = await this.generateEntitySeeds({
            staging: INCOME_LIST_STAGING_JSON,
            seedsDir: financeSeedsDir,
            withSeed: withIncome,
            production: INCOME_LIST_PRODUCTION_JSON,
            development: INCOME_LIST_DEVELOPMENT_JSON,
            withRelations: true,
            filterGenerateEntityFn: (json, item) => json.name === item.name || json.name_code === item.name_code || json.source.name_code === item.source.name_code,
        });

        return {
            months: this.mapperMonthsSeeds(incomes.added),
            incomes,
            incomeSources
        }
    }

    async persistSeeds(withIncomeSource: boolean, withIncome: boolean) {

        const incomeSources = await this.sourceService.persistSeeds(!withIncomeSource && !withIncome);
        const incomes = await this.seeder.persistEntity({
            withSeed: withIncome,
            staging: INCOME_LIST_STAGING_JSON,
            production: INCOME_LIST_PRODUCTION_JSON,
            development: INCOME_LIST_DEVELOPMENT_JSON,
        })

        return {
            months: this.mapperMonthsSeeds(incomes.added),
            incomes,
            incomeSources
        }
    }

    private mapperMonthsSeeds(incomes: Array<Income>): Array<Month> {
        const incomeMonths: Array<Month> = [];

        if(incomes.length === 0) {
            return incomeMonths;
        }

        incomes.forEach((income) => {
            const months = income?.months ?? [];
            if(months.length > 0) {
                incomeMonths.push(...months);
            }
        });

        return incomeMonths;
    }
}