import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { snakeCaseToNormal } from '@repo/services';

import { Bill as BillConstructor, BillBusiness, EBillType } from '@repo/business';

import BILL_LIST_DEVELOPMENT_JSON from '../../../seeds/development/finance/bills.json';
import BILL_LIST_STAGING_JSON from '../../../seeds/staging/finance/bills.json';
import BILL_LIST_PRODUCTION_JSON from '../../../seeds/production/finance/bills.json';

import { ListParams, SeedsGenerated, Service } from '../../shared';

import { Bank } from '../entities/bank.entity';
import { Bill } from '../entities/bill.entity';
import { Expense } from '../entities/expense.entity';
import { Finance } from '../entities/finance.entity';
import { Group } from '../entities/group.entity';
import { Month } from '../entities/month.entity';

import { BankService } from '../bank/bank.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { CreateExpenseDto } from './expense/dto/create-expense.dto';
import { ExpenseService } from './expense/expense.service';
import { GroupService } from '../group/group.service';
import { UpdateBillDto } from './dto/update-bill.dto';
import { UploadsExpenseDto } from './expense/dto/uploads-expense.dto';

type GeneratedBillSeeds = {
    bills: SeedsGenerated<Bill>;
    months: Array<Month>;
    expenses: SeedsGenerated<Expense>;
}

@Injectable()
export class BillService extends Service<Bill> {
    constructor(
        @InjectRepository(Bill)
        protected repository: Repository<Bill>,
        protected billBusiness: BillBusiness,
        protected readonly bankService: BankService,
        protected readonly groupService: GroupService,
        protected readonly expenseService: ExpenseService,
    ) {
        super(
            'bills',
            ['bank', 'group', 'finance', 'expenses', 'expenses.months', 'expenses.supplier', 'expenses.bill', 'expenses.children', 'expenses.children.supplier'],
            repository,
        );
    }

    get expense(): ExpenseService {
        return this.expenseService;
    }

    async create(finance: Finance, createBillDto: CreateBillDto) {
        const bank = await this.bankService.treatEntityParam<Bank>(
            createBillDto.bank,
            'Bank'
        ) as Bank;

        const group = await this.groupService.treatEntityParam<Group>(
            createBillDto.group,
            'Group'
        ) as Group;

        const name = `${group.name} ${snakeCaseToNormal(createBillDto.type)} ${bank.name}`;

        const type = createBillDto.type;

        const bill = new BillConstructor({
            name: type === EBillType.CREDIT_CARD ? `${name} ${bank.name}` : name,
            year: createBillDto.year,
            type,
            finance,
            bank,
            group,
        })

        return await this.customSave(bill);
    }

    async update(finance: Finance, param: string, updateBillDto: UpdateBillDto) {
        const result = await this.findOne({ value: param }) as Bill;

        const bank = !updateBillDto.bank
            ? result.bank
            : await this.bankService.treatEntityParam<Bank>(
                updateBillDto.bank,
                'Bank',
            ) as Bank;

        const group = !updateBillDto.group
            ? result.group
            : await this.groupService.treatEntityParam<Group>(
                updateBillDto.group,
                'Bill Category',
            ) as Group;

        const expenses = !updateBillDto.expenses
            ? result.expenses
            : await Promise.all(
                await this.expenseService.treatEntitiesParams<Expense>(
                    updateBillDto.expenses,
                    'Expense',
                ),
            ) as Array<Expense>;

        const year = !updateBillDto.year ? result.year : updateBillDto.year;
        const type = !updateBillDto.type ? result.type : updateBillDto.type;
        const name =
            !updateBillDto.group && !updateBillDto.type
                ? result.name
                : `${group.name} ${snakeCaseToNormal(type)} ${bank.name}`;

        const updatedBill = new BillConstructor({
            ...result,
            name,
            year,
            type,
            finance,
            bank,
            group,
            expenses
        });
        return await this.customSave(updatedBill);
    }

    async remove(param: string) {
        const result = await this.findOne({
            value: param,
            relations: this.relations,
        }) as Bill;
        if (result?.expenses?.length) {
            throw this.error(
                new ConflictException(
                    'You cannot delete this bill because it is already in use.',
                ),
            );
        }
        await this.repository.softRemove(result);
        return { message: 'Successfully removed' };
    }

    async findAllExpense(param: string, params: ListParams) {
        const bill = await this.findOne({ value: param, withRelations: true }) as Bill;
        return await this.expenseService.findAll({
            ...params,
            filters: [
                {
                    value: bill.id,
                    param: 'bill',
                    condition: '=',
                },
                {
                    value: false,
                    param: 'is_aggregate',
                    condition: '='
                }
            ],
            withRelations: true
        });
    }

    async addExpense(value: string, createExpenseDto: CreateExpenseDto) {
        const bill = await this.findOne({ value, withRelations: true }) as Bill;
        const {
            nextYear,
            requiresNewBill,
            monthsForNextYear,
            expenseForNextYear,
            expenseForCurrentYear
        } = await this.expenseService.create(bill, createExpenseDto);

        if (requiresNewBill && expenseForNextYear) {
            const newBill = await this.create(
                bill.finance,
                { ...bill, year: nextYear }
            ) as Bill;

            await this.expenseService.create(newBill, { ...expenseForNextYear, months: monthsForNextYear })
        }

        return expenseForCurrentYear;
    }

    async persistExpensesByUpload(files: Express.Multer.File[], param: string, uploadsExpenseDto: UploadsExpenseDto) {
        const bill = await this.findOne({ value: param, withRelations: true }) as Bill;
        return this.expenseService.uploads(bill, files, uploadsExpenseDto);
    }

    async generateSeeds(withBill: boolean, withExpense: boolean, financeSeedsDir: string): Promise<GeneratedBillSeeds> {
        const { months, expenses } = await this.expenseService.generateSeeds(withExpense, financeSeedsDir);
        const bills = await this.generateEntitySeeds({
            seedsDir: financeSeedsDir,
            staging: BILL_LIST_STAGING_JSON,
            withSeed: !(!withBill && !withExpense),
            production: BILL_LIST_PRODUCTION_JSON,
            development: BILL_LIST_DEVELOPMENT_JSON,
            withRelations: true,
            filterGenerateEntityFn: (json, item) => json.name === item.name || json.name_code === item.name_code || json.expenses === item.expenses
        })

        return { bills, months, expenses }
    }

    async persistSeeds(withBill: boolean, withExpense: boolean) {
        const bills = await this.seeder.persistEntity({
            withSeed: !(!withBill && !withExpense),
            staging: BILL_LIST_STAGING_JSON,
            production: BILL_LIST_PRODUCTION_JSON,
            development: BILL_LIST_DEVELOPMENT_JSON,
        })

        const { months, expenses } = await this.expenseService.persistSeeds(withExpense);

        return {
            bills,
            months,
            expenses
        }
    }

    private async customSave(bill: Bill, withThrow = true) {
        const existBill = await this.findOne({
            value: bill.name,
            filters: [{
                value: bill.year,
                param: 'year',
                condition: '='
            }],
            withThrow: false,
        });
        if (existBill) {
            if (withThrow) {
                throw new ConflictException(
                    `Key (name)=(${bill.name}) already exists with this (year)=(${bill.year}).`,
                );
            }
            return existBill;
        }
        const calculatedBill = this.billBusiness.calculate(bill);
        return await this.save(calculatedBill);
    }
}