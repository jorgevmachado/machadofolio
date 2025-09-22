import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EMonth, getCurrentMonthNumber } from '@repo/services';

import { Month as MonthConstructor } from '@repo/business';

import { type FilterParams, Service } from '../../shared';

import { Month } from '../entities/month.entity';
import { Income } from '../entities/incomes.entity';
import { MonthDto } from './dto/create-month.dto';

@Injectable()
export class MonthService extends Service<Month> {
    constructor(@InjectRepository(Month) protected repository: Repository<Month>) {
        super('months', [], repository);
    }

    async createByIncome(income: Income) {
        const months: Array<Month> = [];
        for(const month of income?.months || []) {
            month.income = income;
            const currentMonth = await this.save(month);
            if(currentMonth) {
                months.push(currentMonth);
            }
        }
        return months.map((month) => ({ ...month, income: undefined }));
    }

    async updateByIncome(income: Income, monthsToUpdate: Array<Month> = []) {
        const filters: Array<FilterParams> = [{
            value: income.id,
            param: `${this.alias}.income`,
            relation: true,
            condition: '=',
        }];

        const months = (await this.findAll({ filters, withRelations: true })) as Array<Month>;
        for(const month of monthsToUpdate) {
            const existingMonth = months?.find(m => m.code === month.code);
            if(existingMonth) {
                throw new Error(`There is already a month registered in the income: ${month.label}.`);
            }
            month.income = income;
            const currentMonth = await this.save(month);
            if(currentMonth) {
                months.push(currentMonth);
            }
        }

        return months.map((month) => ({ ...month, income: undefined }));
    }

    treatMonths( year?: number, month?: EMonth, months?: Array<MonthDto>, total?: number, received_at?: Date): Array<Month> {
        if( months && months?.length) {
            return months.map((item) => this.treatMonth(item));
        }
        return [
            this.treatMonth({
                year,
                month,
                value: total || 0,
                received_at
            })
        ]
    }

    treatMonth({ month, received_at, ...item }: MonthDto): Month {
        const currentMonthNumber = this.currentMonthNumber(month);
        const receivedAt = received_at ? new Date(received_at) : new Date();
        return new MonthConstructor({
            ...item,
            month: currentMonthNumber,
            received_at: receivedAt
        });
    }

    private currentMonthNumber(month: EMonth = EMonth.JANUARY) {
        try {
            return getCurrentMonthNumber(month);
        } catch (error) {
            throw this.error(error);
        }
    }
}
