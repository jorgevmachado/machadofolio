import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Finance as FinanceConstructor } from '@repo/business';

import FINANCE_LIST_DEVELOPMENT_JSON from '../../seeds/development/finance/finances.json';
import FINANCE_LIST_STAGING_JSON from '../../seeds/staging/finance/finances.json';
import FINANCE_LIST_PRODUCTION_JSON from '../../seeds/production/finance/finances.json';

import { SeedsGenerated, Service } from '../shared';

import { User } from '../auth/entities/user.entity';

import { Bank } from './entities/bank.entity';
import { BankService } from './bank/bank.service';
import { IncomeService } from './income/income.service';

import { Bill } from './entities/bill.entity';
import { BillService } from './bill/bill.service';
import { Expense } from './entities/expense.entity';
import { Finance } from './entities/finance.entity';
import { FinanceSeedsResult } from './types';
import { Group } from './entities/group.entity';
import { GroupService } from './group/group.service';
import { Income } from './entities/incomes.entity';
import { IncomeSource } from './entities/income-source.entity';
import { Supplier } from './entities/supplier.entity';
import { SupplierService } from './supplier/supplier.service';
import { SupplierType } from './entities/type.entity';
import { CreateFinanceSeedsDto } from './dto/create-finance-seeds.dto';
import { Month } from './entities/month.entity';
import { MonthService } from './month/month.service';

export type FinanceGenerateSeeds = {
    bills: SeedsGenerated<Bill>;
    banks: SeedsGenerated<Bank>;
    months: SeedsGenerated<Month>;
    groups: SeedsGenerated<Group>;
    incomes: SeedsGenerated<Income>;
    expenses: SeedsGenerated<Expense>;
    finances: SeedsGenerated<Finance>;
    suppliers: SeedsGenerated<Supplier>;
    supplierTypes: SeedsGenerated<SupplierType>;
    incomeSources: SeedsGenerated<IncomeSource>;
}

@Injectable()
export class FinanceService extends Service<Finance> {
    private DEFAULT_SEEDS_RESULT: FinanceGenerateSeeds = {
        bills: {
            list: [],
            added: []
        },
        banks: {
            list: [],
            added: []
        },
        months: {
            list: [],
            added: []
        },
        groups: {
            list: [],
            added: []
        },
        incomes: {
            list: [],
            added: []
        },
        expenses: {
            list: [],
            added: []
        },
        finances: {
            list: [],
            added: []
        },
        suppliers: {
            list: [],
            added: []
        },
        supplierTypes: {
            list: [],
            added: []
        },
        incomeSources: {
            list: [],
            added: []
        }
    }

    constructor(
        @InjectRepository(Finance)
        protected repository: Repository<Finance>,
        protected readonly bankService: BankService,
        protected readonly groupService: GroupService,
        protected readonly supplierService: SupplierService,
        protected readonly billService: BillService,
        protected readonly incomeService: IncomeService,
        protected readonly monthService: MonthService,
    ) {
        super('finances', ['bills', 'groups', 'bills.expenses'], repository);
    }

    async create(user: User) {
        if (user?.finance) {
            return {
                ...user.finance,
                user
            };
        }
        const finance = new FinanceConstructor({ user });
        return await this.save(finance);
    }

    async getByUser(user: User) {
        const userFinance = this.validateFinance(user);
        const finance = await this.findOne({ value: userFinance.id, withRelations: true }) as Finance;
        finance.user = user;
        const bills = await this.billService.findAll({
            filters: [{
                value: finance.id,
                param: 'finance',
                condition: '='
            }],
            withRelations: true
        }) as Array<Bill>;
        const groups = finance?.groups ?? [];
        const expenses = bills?.flatMap((bill) => bill?.expenses).filter((item) => !!item);
        const { total, allPaid, totalPaid, totalPending } = this.billService.expense.business.calculateAll(expenses);
        const banks = await this.bankService.findAll({}) as Array<Bank>;
        const suppliers = await this.supplierService.findAll({ withRelations: true }) as Array<Supplier>;
        const supplierTypes = await this.supplierService.type.findAll({}) as Array<SupplierType>;
        const incomes = await this.incomeService.findAll({ withRelations: true }) as Array<Income>;
        const incomeSources = await this.incomeService.source.findAll({}) as Array<IncomeSource>;
        return {
            finance,
            groups,
            bills,
            banks,
            suppliers,
            supplierTypes,
            expenses,
            incomes,
            incomeSources,
            total,
            allPaid,
            totalPaid,
            totalPending,
        };
    }

    public async generateSeeds(createFinanceSeedsDto: CreateFinanceSeedsDto): Promise<FinanceSeedsResult> {
        const seedsDto = this.validateFinanceSeedsDto(createFinanceSeedsDto);
        const result: FinanceGenerateSeeds = this.DEFAULT_SEEDS_RESULT;

        const rootSeedsDir = this.file.getSeedsDirectory();
        const financeSeedsDir = this.file.createDirectory('finance', rootSeedsDir);

        result.banks = await this.bankService.generateSeeds(Boolean(seedsDto.bank), financeSeedsDir);

        const {
            suppliers,
            supplierTypes
        } = await this.supplierService.generateSeeds(Boolean(seedsDto.supplierType), Boolean(seedsDto.supplier), financeSeedsDir);
        result.suppliers = suppliers;
        result.supplierTypes = supplierTypes

        result.finances = await this.generateEntitySeeds({
            seedsDir: financeSeedsDir,
            staging: FINANCE_LIST_STAGING_JSON,
            withSeed: seedsDto.finance,
            production: FINANCE_LIST_PRODUCTION_JSON,
            development: FINANCE_LIST_DEVELOPMENT_JSON,
            withRelations: true,
            filterGenerateEntityFn: (json, item) => json.id === item.id || json.bills === item.bills || json.groups === item.groups
        });

        const {
            months: incomeMonths,
            incomes,
            incomeSources
        } = await this.incomeService.generateSeeds(Boolean(seedsDto.incomeSource), Boolean(seedsDto.income), financeSeedsDir);
        result.incomes = incomes;
        result.incomeSources = incomeSources;

        if (incomeMonths.length > 0) {
            result.months.list.push(...incomeMonths);
        }

        result.groups = await this.groupService.generateSeeds(Boolean(seedsDto.group), financeSeedsDir);

        const {
            bills,
            months: expenseMonths,
            expenses
        } = await this.billService.generateSeeds(Boolean(seedsDto.bill), Boolean(seedsDto.expense), financeSeedsDir);

        result.bills = bills;
        result.expenses = expenses;

        if (expenseMonths.length > 0) {
            result.months.list.push(...expenseMonths);
        }

        result.months = await this.monthService.generateSeeds(result.months.list, financeSeedsDir);

        return this.mapperFinanceSeedsResult(result);
    }

    public async persistSeeds(createFinanceSeedsDto: CreateFinanceSeedsDto) {
        const seedsDto = this.validateFinanceSeedsDto(createFinanceSeedsDto);
        const result: FinanceGenerateSeeds = this.DEFAULT_SEEDS_RESULT;

        result.banks = await this.bankService.persistSeeds(seedsDto?.bank);

        const {
            suppliers,
            supplierTypes
        } = await this.supplierService.persistSeeds(Boolean(seedsDto.supplierType), Boolean(seedsDto.supplier));
        result.suppliers = suppliers;
        result.supplierTypes = supplierTypes

        result.finances = await this.seeder.persistEntity({
            withSeed: seedsDto.finance,
            staging: FINANCE_LIST_STAGING_JSON,
            production: FINANCE_LIST_PRODUCTION_JSON,
            development: FINANCE_LIST_DEVELOPMENT_JSON,
            persistEntityFn: (item) => ({
                ...item,
                bills: undefined,
                groups: undefined,
            })
        });

        result.groups = await this.groupService.persistSeeds(seedsDto?.group);

        const {
            months: incomeMonths,
            incomes,
            incomeSources
        } = await this.incomeService.persistSeeds(Boolean(seedsDto.incomeSource), Boolean(seedsDto.income));
        result.incomes = incomes;
        result.incomeSources = incomeSources;

        if (incomeMonths.length > 0) {
            result.months.list.push(...incomeMonths);
        }

        const {
            bills,
            months: expenseMonths,
            expenses
        } = await this.billService.persistSeeds(Boolean(seedsDto.bill), Boolean(seedsDto.expense));

        result.bills = bills;
        result.expenses = expenses;

        if (expenseMonths.length > 0) {
            result.months.list.push(...expenseMonths);
        }

        result.months = await this.monthService.persistSeeds(result.months.list);

        return this.mapperFinanceSeedsResult(result);
    }

    private validateFinanceSeedsDto(createFinanceSeedsDto: CreateFinanceSeedsDto) {
        const seedsDto = { ...createFinanceSeedsDto };
        if (createFinanceSeedsDto.income) {
            seedsDto.finance = true;
            seedsDto.incomeSource = true;
        }

        if (createFinanceSeedsDto.expense) {
            seedsDto.bill = true;
        }

        if (createFinanceSeedsDto.bill) {
            seedsDto.bank = true;
            seedsDto.group = true;
            seedsDto.finance = true;
            seedsDto.supplier = true;
        }

        if (createFinanceSeedsDto.group) {
            seedsDto.finance = true;
        }

        if (createFinanceSeedsDto.supplier) {
            seedsDto.supplierType = true;
        }

        return seedsDto;
    }

    private mapperFinanceSeedsResult(generateSeeds: FinanceGenerateSeeds): FinanceSeedsResult {
        const {
            bills,
            banks,
            months,
            groups,
            incomes,
            expenses,
            finances,
            suppliers,
            supplierTypes,
            incomeSources,
        } = generateSeeds;
        return {
            bill: {
                list: bills.list.length,
                added: bills.added.length
            },
            bank: {
                list: banks.list.length,
                added: banks.added.length
            },
            group: {
                list: groups.list.length,
                added: groups.added.length
            },
            months: { list: months.list.length, added: months.added.length },
            income: {
                list: incomes.list.length,
                added: incomes.added.length
            },
            finance: {
                list: finances.list.length,
                added: finances.added.length
            },
            expense: {
                list: expenses.list.length,
                added: expenses.added.length
            },
            supplier: {
                list: suppliers.list.length,
                added: suppliers.added.length
            },
            supplierType: {
                list: supplierTypes.list.length,
                added: supplierTypes.added.length
            },
            incomeSource: {
                list: incomeSources.list.length,
                added: incomeSources.added.length
            },
        }
    }

    private validateFinance(user: User): Finance {
        if (!user?.finance) {
            throw new NotFoundException('Finance not found');
        }
        return user.finance;
    }

}
