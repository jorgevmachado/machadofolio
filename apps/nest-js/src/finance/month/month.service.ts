import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EMonth, getCurrentMonthNumber } from '@repo/services';

import { MonthBusiness, Month as MonthConstructor } from '@repo/business';

import MONTH_LIST_DEVELOPMENT_JSON from '../../../seeds/development/finance/months.json';
import MONTH_LIST_STAGING_JSON from '../../../seeds/staging/finance/months.json';
import MONTH_LIST_PRODUCTION_JSON from '../../../seeds/production/finance/months.json';

import { type FilterParams, GenerateSeeds, Service } from '../../shared';

import { Expense } from '../entities/expense.entity';
import { Income } from '../entities/incomes.entity';
import { Month } from '../entities/month.entity';

import { PersistMonthDto } from './dto/persist-month.dto';

@Injectable()
export class MonthService extends Service<Month> {
    constructor(
        @InjectRepository(Month)
        protected repository: Repository<Month>,
        protected monthBusiness: MonthBusiness
    ) {
        super('months', ['expense', 'income'], repository);
    }

    get business(): MonthBusiness {
        return this.monthBusiness;
    }

    async findAllByRelationship(id: string, relationship: 'income' | 'expense') {
        const filters: Array<FilterParams> = [{
            value: id,
            param: `${this.alias}.${relationship}`,
            relation: true,
            condition: '=',
        }];

        return await this.findAll({ filters, withRelations: true }) as Array<Month>;
    }

    async persistList(months: Array<PersistMonthDto>, relation: { income?: Income, expense?: Expense }) {
        if ((!relation.income && !relation.expense) || (relation.income && relation.expense)) {
            throw new BadRequestException('Enter only income or expenses to associate with the months.');
        }

        const id = (!relation.income ? relation.expense?.id : relation.income?.id) as string;
        const relationship = !relation.income ? 'expense' : 'income';

        const existingMonths = await this.findAllByRelationship(id, relationship);
        const monthsToPersist = months.map((item) => {
            const code = !item?.code ? this.currentMonthNumber(item.month?.toLowerCase()) : item.code;
            const existingMonth = existingMonths?.find(m => m.code === code);
            return new MonthConstructor({
                ...existingMonth,
                ...item,
                code,
                ...(relation.income && { income: relation.income }),
                ...(relation.expense && { expense: relation.expense }),
                received_at: item.received_at ? new Date(item.received_at) : new Date(),
            });
        });

        const savedMonths: Array<Month> = [];

        for (const monthToPersist of monthsToPersist) {
            const month = await this.save(monthToPersist);

            if (month) {
                savedMonths.push(month);
            }
        }


        if (existingMonths.length > 0) {
            const persistedMonths: Array<Month> = existingMonths.map((existingMonth) => {
                const persistedMonth = savedMonths.find((m) => m.code === existingMonth.code);
                if (persistedMonth) {
                    return persistedMonth;
                }
                return existingMonth;
            });
            return persistedMonths.map((month) => ({ ...month, expense: undefined, income: undefined }))
                .sort((a, b) => a.code - b.code);
        }

        return savedMonths.map((month) => ({ ...month, expense: undefined, income: undefined }))
            .sort((a, b) => a.code - b.code);
    }

    async removeList(relation: { income?: Income, expense?: Expense }) {
        if ((!relation.income && !relation.expense) || (relation.income && relation.expense)) {
            throw new BadRequestException('Report only income or expenses to dissociate them from the months.');
        }

        const id = (!relation.income ? relation.expense?.id : relation.income?.id) as string;
        const relationship = !relation.income ? 'expense' : 'income';

        const existingMonths = await this.findAllByRelationship(id, relationship);

        if (!existingMonths || existingMonths.length === 0) {
            return { message: `No months found in ${relationship} to remove.` };
        }
        for (const month of existingMonths) {
            await this.repository.softRemove(month);
        }

        return { message: `All Months by ${relationship} Successfully removed` };
    }

    private currentMonthNumber(month: string = EMonth.JANUARY) {
        try {
            return getCurrentMonthNumber(month);
        } catch (error) {
            throw this.error(error);
        }
    }

    async generateSeeds(months: Array<Month>): Promise<GenerateSeeds<Month>> {
        if(months.length <= 0) {
            return {
                list: [],
                added: []
            }
        }

        const monthsFromDataBase: Array<Month> = [];

        for( const month of months) {
            const monthInDataBase = await this.findOne({ value: month.id, withRelations: true, withDeleted: true, withThrow: false });
            if(monthInDataBase) {
                monthsFromDataBase.push(month);
            }
        }

        if(monthsFromDataBase.length <= 0) {
            return {
                list: [],
                added: []
            }
        }

        const listJson = this.getListJson<Month>({
            staging: MONTH_LIST_STAGING_JSON,
            production: MONTH_LIST_PRODUCTION_JSON,
            development: MONTH_LIST_DEVELOPMENT_JSON,
        });
        const added = monthsFromDataBase.filter((item) => !listJson.find((json) => json.id === item.id || json.label === item.label || json.code === item.code));

        return { list: monthsFromDataBase, added };
    }
}
