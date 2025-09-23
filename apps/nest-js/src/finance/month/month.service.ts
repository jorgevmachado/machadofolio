import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EMonth, getCurrentMonthNumber } from '@repo/services';

import { Month as MonthConstructor } from '@repo/business';

import { type FilterParams, Service } from '../../shared';

import { Month } from '../entities/month.entity';
import { Income } from '../entities/incomes.entity';
import { CreateMonthDto } from './dto/create-month.dto';
import { UpdateMonthDto } from './dto/update-month.dto';

export type CreateByIncomeParams = {
    value: number;
    month?: EMonth;
    income: Income;
    isCreate: boolean;
    received_at?: Date;
    monthsToCreate?: Array<CreateMonthDto>;
}

@Injectable()
export class MonthService extends Service<Month> {
    constructor(@InjectRepository(Month) protected repository: Repository<Month>) {
        super('months', [], repository);
    }

    async listByIncome(incomeId: string) {
        const filters: Array<FilterParams> = [{
            value: incomeId,
            param: `${this.alias}.income`,
            relation: true,
            condition: '=',
        }];

        return await this.findAll({ filters, withRelations: true });
    }

    async createByIncome(income: Income, isCreate: boolean,  value: number, month?: EMonth,  monthsToCreate?: Array<CreateMonthDto>, received_at?: Date) {
        const monthsToPersist = this.treatMonths(income.year, month, monthsToCreate, value, received_at);
        const months: Array<Month> = isCreate ? [] : await this.listByIncome(income.id) as Array<Month>;
        for(const month of monthsToPersist) {
            if(!isCreate) {
                const existingMonth = months?.find(m => m.code === month.code);
                if(existingMonth) {
                    throw new Error(`There is already a month registered in the income: ${month.label}.`);
                }
            }
            month.income = income;
            const currentMonth = await this.save(month);
            if(currentMonth) {
                months.push(currentMonth);
            }
        }
        return months.map((month) => ({ ...month, income: undefined }));
    }

    async updateByIncome(income: Income, monthsToUpdate: Array<UpdateMonthDto> = []) {
        const months = await this.listByIncome(income.id) as Array<Month>;

        for(const month of monthsToUpdate) {
            const existingMonth = months?.find(m => m.id === month.id);
            if(existingMonth) {
                const monthBuilt = new MonthConstructor({
                    ...existingMonth,
                    code: month.code || existingMonth.code,
                    year: month.year || existingMonth.year,
                    paid: month.paid || existingMonth.paid,
                    value: month.value || existingMonth.value,
                    received_at: month.received_at || existingMonth.received_at,
                });
                const currentMonth = await this.save(monthBuilt);
                if(currentMonth) {
                    const monthToUpdateIndex = months.findIndex(m => m.code === currentMonth.code);
                    months[monthToUpdateIndex] = currentMonth;
                }
            }
        }
        return months.map((month) => ({ ...month, income: undefined }));
    }

    async update(income: Income, body: UpdateMonthDto) {
        const result = await this.findOne({ value: body.id, withDeleted: true });
        const month = new MonthConstructor({ ...result, ...body, income });
        return this.save(month);
    }

    treatMonths( year?: number, month?: EMonth, months?: Array<CreateMonthDto>, total?: number, received_at?: Date): Array<Month> {
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

    treatMonth({ month, received_at, ...item }: CreateMonthDto): Month {
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

    async removeByIncome(income: Income) {
        const monthsToRemove = await this.listByIncome(income.id) as Array<Month>;

        for(const month of monthsToRemove) {
            await this.remove(month.id);
        }

        return { message: 'All Months by Income Successfully removed' };
    }
}
