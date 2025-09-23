import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EMonth, getCurrentMonthNumber, MONTHS, TMonth } from '@repo/services';

import { Month as MonthConstructor } from '@repo/business';

import { type FilterParams, Service } from '../../shared';

import { Month } from '../entities/month.entity';
import { Income } from '../entities/incomes.entity';
import { CreateMonthDto } from './dto/create-month.dto';
import { UpdateMonthDto } from './dto/update-month.dto';
import { Expense } from '../entities/expense.entity';


type TRelationship = 'income' | 'expense';

export type CreateByIncomeParams = {
    value: number;
    month?: EMonth;
    income: Income;
    isCreate: boolean;
    received_at?: Date;
    monthsToCreate?: Array<CreateMonthDto>;
}

export type CreateByRelationshipParams = {
    year?: number;
    paid?: boolean;
    value: number;
    month?: EMonth;
    income?: Income;
    expense?: Expense;
    isCreate?: boolean;
    received_at?: Date;
    listOfMonths?: Array<TMonth>;
    monthsToCreate?: Array<CreateMonthDto>;
}

export type UpdateByRelationshipParams = {
    paid?: boolean;
    income?: Income;
    expense?: Expense;
    monthsToUpdate: Array<UpdateMonthDto>
}

type HandleMonthsParams = {
    id: string;
    year?: number;
    paid?: boolean;
    expense?: Expense;
    isCreate: boolean;
    received_at?: Date;
    relationship: TRelationship;
}

type TreatMonthsParams = {
    year?: number;
    month?: EMonth;
    value?: number;
    received_at?: Date;
    listOfMonths?: Array<TMonth>;
    monthsToCreate?: Array<CreateMonthDto>;
}

@Injectable()
export class MonthService extends Service<Month> {
    constructor(@InjectRepository(Month) protected repository: Repository<Month>) {
        super('months', [], repository);
    }

    async createByRelationship({ year, paid = false, value, month, isCreate = true, income, expense, listOfMonths, monthsToCreate, received_at }: CreateByRelationshipParams) {
        if(!income && !expense) {
            throw new Error('Income or Expense is required.');
        }

        const id = (!income ? expense?.id : income?.id) as string;
        const relationship = !income ? 'expense' : 'income';
        const monthsToPersist = this.treatMonths({ year, month, monthsToCreate, listOfMonths, value, received_at});
        const months: Array<Month> =  await this.handleMonths({id, year, paid, isCreate, expense, received_at, relationship });

        for(const month of monthsToPersist) {
            const existingMonth = months?.find(m => m.code === month.code);
            month.income = relationship === 'income' ? income : undefined;
            month.expense = relationship === 'expense' ? expense : undefined;

            if(existingMonth && !isCreate) {
                throw new Error(`There is already a month registered in the ${relationship}: ${month.label}.`);
            }

            const builtMonth = existingMonth ? { ...existingMonth, ...month } : month;

            const currentMonth = await this.save(builtMonth);
            if(currentMonth && !existingMonth) {
                months.push(currentMonth);
            }

            if(currentMonth && existingMonth) {
                const monthToCreateIndex = months.findIndex(m => m.code === existingMonth.code);
                months[monthToCreateIndex] = currentMonth;
            }
        }

        return months
            .map((month) => ({ ...month, expense: undefined }))
            .sort((a, b) => a.code - b.code);
    }

    async updateByRelationship({ paid = false, income, expense, monthsToUpdate }: UpdateByRelationshipParams) {
        if(!income && !expense) {
            throw new Error('Income or Expense is required.');
        }
        const id = (!income ? expense?.id : income?.id) as string;
        const relationship = !income ? 'expense' : 'income';
        const months = await this.listByRelationship(id, relationship) as Array<Month>;
        for(const month of months) {
            const existingMonthToUpdate = monthsToUpdate
                .map((mtu) => months.find((m) => m.id === mtu.id))[0];

            if(month.paid !== paid || existingMonthToUpdate) {
                const currentPaid = month.paid !== paid ? paid : existingMonthToUpdate?.paid || month.paid;
                const monthBuild = new MonthConstructor({
                    ...month,
                    paid: currentPaid,
                    code: existingMonthToUpdate?.code || month.code,
                    year: existingMonthToUpdate?.year || month.year,
                    value: existingMonthToUpdate?.value || month.value,
                    received_at: existingMonthToUpdate?.received_at || month.received_at,
                })
                const currentMonth = await this.save(monthBuild);
                if(currentMonth) {
                    const monthToUpdateIndex = months.findIndex(m => m.code === currentMonth.code);
                    months[monthToUpdateIndex] = currentMonth;
                }
            }


        }
        return months
            .map((month) => ({ ...month, expense: undefined }))
            .sort((a, b) => a.code - b.code);

    }

    private async handleMonths({ id, year, paid, isCreate, expense, received_at, relationship, }: HandleMonthsParams) {
        if(relationship === 'income' && !isCreate) {
            return  await this.listByRelationship(id, relationship) as Array<Month>;
        }
        if(relationship === 'expense') {
            const months: Array<Month> = [];
            for (const month of MONTHS) {
                const code = this.currentMonthNumber(month);
                const monthBuilt = new MonthConstructor({
                    year,
                    paid,
                    code,
                    value: 0,
                    expense,
                    received_at,
                });
                const currentMonth = await this.save(monthBuilt);
                if(currentMonth) {
                    months.push(currentMonth);
                }
            }
            return months;
        }
        return [];
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

    async createByIncome(income: Income, isCreate: boolean,  value: number, month?: EMonth,  monthsToCreate?: Array<CreateMonthDto>, received_at?: Date) {
        const monthsToPersist = this.treatMonths({ year: income.year, month, monthsToCreate, value, received_at});
        const months: Array<Month> = isCreate ? [] : await this.listByRelationship(income.id, 'income') as Array<Month>;
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
        const months = await this.listByRelationship(income.id, 'income') as Array<Month>;

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

    treatMonths({ year, value = 0, month, listOfMonths, monthsToCreate, received_at }: TreatMonthsParams ): Array<Month> {
        if(listOfMonths && listOfMonths.length) {
            return listOfMonths.map((item) => this.treatMonth({ year, month: item.toUpperCase() as EMonth, value, received_at }));
        }

        if( monthsToCreate && monthsToCreate?.length) {
            return monthsToCreate.map((item) => this.treatMonth(item));
        }

        return [
            this.treatMonth({
                year,
                month,
                value,
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

    private currentMonthNumber(month: string = EMonth.JANUARY) {
        try {
            return getCurrentMonthNumber(month);
        } catch (error) {
            throw this.error(error);
        }
    }

    async removeByIncome(income: Income) {
        const monthsToRemove = await this.listByRelationship(income.id, 'income') as Array<Month>;

        for(const month of monthsToRemove) {
            await this.remove(month.id);
        }

        return { message: 'All Months by Income Successfully removed' };
    }
}
