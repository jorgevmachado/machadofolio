import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EMonth, getCurrentMonthNumber } from '@repo/services';

import { Month as MonthConstructor, MonthBusiness } from '@repo/business';

import { type FilterParams, Service } from '../../shared';

import { Month } from '../entities/month.entity';
import { Income } from '../entities/incomes.entity';

import { Expense } from '../entities/expense.entity';
import { PersistMonthDto } from './dto/persist-month.dto';

@Injectable()
export class MonthService extends Service<Month> {
    constructor(
        @InjectRepository(Month)
        protected repository: Repository<Month>,
        protected monthBusiness: MonthBusiness
    ) {
        super('months', [], repository);
    }

    get business(): MonthBusiness {
        return this.monthBusiness;
    }

    async listByRelationship(id: string, relationship: 'income' | 'expense') {
        const filters: Array<FilterParams> = [{
            value: id,
            param: `${this.alias}.${relationship}`,
            relation: true,
            condition: '=',
        }];

        return await this.findAll({ filters, withRelations: true });
    }

    async removeByIncome(income: Income) {
        const monthsToRemove = await this.listByRelationship(income.id, 'income') as Array<Month>;

        for (const month of monthsToRemove) {
            await this.remove(month.id);
        }

        return { message: 'All Months by Income Successfully removed' };
    }

    async persistList(months: Array<PersistMonthDto>, relation: { income?: Income, expense?: Expense }) {
        if ((!relation.income && !relation.expense) || (relation.income && relation.expense)) {
            throw new Error('Enter only income or expenses to associate with the months.');
        }

        const id = (!relation.income ? relation.expense?.id : relation.income?.id) as string;
        const relationship = !relation.income ? 'expense' : 'income';

        const existingMonths = await this.findAll({
            filters: [{
                value: id,
                param: `${this.alias}.${relationship}`,
                relation: true,
                condition: '=',
            }], withRelations: true
        }) as Array<Month>;
        const monthsToPersist = months.map((item) => {
            const code = !item?.code ? this.currentMonthNumber(item.month) : item.code;
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
            throw new Error('Report only income or expenses to dissociate them from the months.');
        }

        const id = (!relation.income ? relation.expense?.id : relation.income?.id) as string;
        const relationship = !relation.income ? 'expense' : 'income';

        const existingMonths = await this.findAll({
            filters: [{
                value: id,
                param: `${this.alias}.${relationship}`,
                relation: true,
                condition: '=',
            }], withRelations: true
        }) as Array<Month>;

        if (!existingMonths) {
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
}
