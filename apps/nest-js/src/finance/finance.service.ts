import { Buffer } from 'buffer';

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Spreadsheet } from '@repo/services';

import { Finance as FinanceConstructor } from '@repo/business';

import FINANCE_LIST_DEVELOPMENT_JSON from '../../seeds/development/finance/finances.json';
import FINANCE_LIST_STAGING_JSON from '../../seeds/staging/finance/finances.json';
import FINANCE_LIST_PRODUCTION_JSON from '../../seeds/production/finance/finances.json';

import { GenerateSeeds, Service } from '../shared';

import { User } from '../auth/entities/user.entity';

import { Bank } from './entities/bank.entity';
import { BankService } from './bank/bank.service';
import { IncomeService } from './income/income.service';

import { Bill } from './entities/bill.entity';
import { BillService } from './bill/bill.service';
import { Expense } from './entities/expense.entity';
import { Finance } from './entities/finance.entity';
import { FinanceSeedsParams } from './types';
import { Group } from './entities/group.entity';
import { GroupService } from './group/group.service';
import { Income } from './entities/incomes.entity';
import { IncomeSource } from './entities/income-source.entity';
import { Supplier } from './entities/supplier.entity';
import { SupplierService } from './supplier/supplier.service';
import { SupplierType } from './entities/type.entity';
import { CreateFinanceSeedsDto } from './dto/create-finance-seeds.dto';
import { Month } from './entities/month.entity';

type GenerateSeedsResult = {
    bills: GenerateSeeds<Bill>;
    banks: GenerateSeeds<Bank>;
    months: GenerateSeeds<Month>;
    groups: GenerateSeeds<Group>;
    incomes: GenerateSeeds<Income>;
    expenses: GenerateSeeds<Expense>;
    finances: GenerateSeeds<Finance>;
    suppliers: GenerateSeeds<Supplier>;
    supplierTypes: GenerateSeeds<SupplierType>;
    incomeSources: GenerateSeeds<IncomeSource>;
}

@Injectable()
export class FinanceService extends Service<Finance> {
    constructor(
        @InjectRepository(Finance)
        protected repository: Repository<Finance>,
        protected readonly bankService: BankService,
        protected readonly groupService: GroupService,
        protected readonly supplierService: SupplierService,
        protected readonly billService: BillService,
        protected readonly incomeService: IncomeService,
    ) {
        super('finances', ['bills', 'groups', 'bills.expenses'], repository);
    }

    async initialize(user: User) {
        if (user?.finance) {
            return {
                ...user.finance,
                user
            };
        }
        const finance = new FinanceConstructor({ user });
        return await this.save(finance);
    }

    async generateDocument(user: User, year?: number): Promise<Buffer> {
        const finance = this.validateFinance(user);
        const groups = await this.fetchGroups(finance.id);

        const sheet = new Spreadsheet();
        const groupsName: Array<string> = groups.map((group) => group.name);
        await Promise.all(
            groups.map(group => this.billService.spreadsheetProcessing({
                year,
                groupId: group.id,
                sheet,
                startRow: 14,
                groupName: group.name,
                tableWidth: 3,
                groupsName,
                startColumn: 2,
            }))
        )

        return await sheet.generateSheetBuffer();
    }

    private validateFinance(user: User): Finance {
        if (!user?.finance) {
            throw new NotFoundException('Finance not found');
        }
        return user.finance;
    }

    private async fetchGroups(financeId: string) {
        return await this.groupService.findAll({
            filters: [{
                value: financeId,
                param: 'finance',
                condition: '='
            }],
            withRelations: true
        }) as Array<Group>;
    }

    async seeds(financeSeedsParams: FinanceSeedsParams) {
        const finances = await this.seed(financeSeedsParams.financeListJson, financeSeedsParams.users, financeSeedsParams.user) as Array<Finance>;

        const banks: Array<Bank> = await this.seeder.executeSeed<Bank>({
            label: 'Banks',
            seedMethod: async () => {
                const result = await this.bankService.seeds({ bankListJson: financeSeedsParams.bankListJson });
                return Array.isArray(result) ? result : [];
            }
        });

        const groups: Array<Group> = await this.seeder.executeSeed<Group>({
            label: 'Group',
            seedMethod: async () => {
                const result = await this.groupService.seeds({
                    finances,
                    groupListJson: financeSeedsParams.groupListJson
                });
                return Array.isArray(result) ? result : [];
            }
        });

        const {
            supplierList,
            supplierTypeList
        } = await this.supplierService.seeds({
            supplierListJson: financeSeedsParams.supplierListJson,
            supplierTypeListJson: financeSeedsParams.supplierTypeListJson
        });

        const suppliers: Array<Supplier> = supplierList;
        const supplierTypes: Array<SupplierType> = supplierTypeList;

        const addedBillIds = new Set<string>();
        const bills: Array<Bill> = [];

        const addedExpenseIds = new Set<string>();
        const expenses: Array<Expense> = [];

        const incomes: Array<Income> = [];
        const incomeSources: Array<IncomeSource> = [];

        const financeListSeed = this.seeder.currentSeeds<Finance>({ seedsJson: financeSeedsParams.financeListJson });

        for (const finance of finances) {
            const financeSeed = financeListSeed.find((item) => item.id === finance.id);
            if (financeSeed) {
                const {
                    incomeList,
                    incomeSourceList,
                } = await this.incomeService.seeds({
                    finance: financeSeed,
                    incomeListJson: financeSeedsParams.incomeListJson,
                    incomeSourceListJson: financeSeedsParams.incomeSourceListJson,
                })

                incomes.push(...incomeList);
                incomeSources.push(...incomeSourceList);

                const billList = await this.seeder.executeSeed<Bill>({
                    label: 'Bills',
                    seedMethod: async () => {
                        const result = await this.billService.seeds({
                            finance: financeSeed,
                            banks,
                            groups,
                            billListJson: financeSeedsParams.billListJson,
                        });
                        return Array.isArray(result) ? result : [];
                    },
                });

                for (const bill of billList) {
                    if (!addedBillIds.has(bill.id)) {
                        bills.push(bill);
                        addedBillIds.add(bill.id);
                    }
                }

                const expenseList = await this.seeder.executeSeed<Expense>({
                    label: 'Expenses',
                    seedMethod: async () => {
                        const result = await this.billService.expense.seeds({
                            bills: billList,
                            suppliers,
                            billListJson: financeSeedsParams.billListJson,
                            expenseListJson: financeSeedsParams.expenseListJson,
                        });
                        return Array.isArray(result) ? result : [];
                    },
                });
                for (const expense of expenseList) {
                    if (!addedExpenseIds.has(expense.id)) {
                        expenses.push(expense);
                        addedExpenseIds.add(expense.id);
                    }
                }
            }
        }


        return {
            bills: bills,
            groups: groups,
            banks: banks,
            expenses: expenses,
            finances: finances,
            suppliers: suppliers,
            supplierTypes: supplierTypes,
            incomes: incomes,
            incomeSources: incomeSources,
        }
    }

    private async seed(seedsJson: Array<unknown> = [], users: Array<User> = [], user?: User) {
        if (user && seedsJson.length > 0) {
            const firstSeedsJson = seedsJson[0];
            const firstSeedJsonIndex = seedsJson.findIndex((item) => item === firstSeedsJson);
            if(firstSeedsJson?.['user']) {
                firstSeedsJson['user'] = user;
                seedsJson[firstSeedJsonIndex] = firstSeedsJson;
                users.push(user);
            }
        }

        return this.seeder.entities({
            by: 'id',
            key: 'all',
            label: 'Finance',
            seedsJson,
            withReturnSeed: true,
            createdEntityFn: async (entity) => {
                const user = users?.find((item) => item.cpf === entity.user.cpf);
                if (!user) {
                    return;
                }
                return new FinanceConstructor({
                    ...entity,
                    user,
                    bills: undefined,
                })
            }
        });
    }

    async initializeWithDocument(file: Express.Multer.File, user: User) {
        if (!file?.buffer) {
            throw new ConflictException('File not sent or invalid.');
        }

        const finance = await this.initialize(user) as Finance;

        return await this.billService.initializeBySpreadsheet(file.buffer, finance);
    }

    async getByUser(user: User) {
        const userFinance = this.validateFinance(user);
        const finance = await this.findOne({ value: userFinance.id, withRelations: true }) as Finance;
        finance.user = user;
        const bills = await this.fetchBills(finance.id);
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

    private async fetchBills(financeId: string) {
        return await this.billService.findAll({
            filters: [{
                value: financeId,
                param: 'finance',
                condition: '='
            }],
            withRelations: true
        }) as Array<Bill>;
    }

    public async generateSeeds(createFinanceSeedsDto: CreateFinanceSeedsDto): Promise<GenerateSeedsResult> {
        const seedsDto = this.validateFinanceSeedsDto(createFinanceSeedsDto);
        const result: GenerateSeedsResult = {
            bills: {
                list: [],
                added: []
            },
            banks: {
                list: [],
                added: []
            },
            months:{
                list: [],
                added: []
            },
            groups:{
                list: [],
                added: []
            },
            incomes:{
                list: [],
                added: []
            },
            expenses:{
                list: [],
                added: []
            },
            finances:{
                list: [],
                added: []
            },
            suppliers:{
                list: [],
                added: []
            },
            supplierTypes:{
                list: [],
                added: []
            },
            incomeSources:{
                list: [],
                added: []
            }
        }

        const rootSeedsDir = this.file.getSeedsDirectory();
        const financeSeedsDir = this.file.createDirectory('finance', rootSeedsDir);

        if(seedsDto.bank) {
            result.banks = await this.bankService.generateSeeds(financeSeedsDir);
        }

        if(seedsDto.supplier || seedsDto.supplierType) {
            const {
                suppliers,
                supplierTypes
            } = await this.supplierService.generateSeeds(Boolean(seedsDto.supplierType), Boolean(seedsDto.supplier), financeSeedsDir);
            result.suppliers = suppliers;
            result.supplierTypes = supplierTypes
        }

        if(seedsDto.finance) {
            const financeList = await this.findAll({ withRelations: true, withDeleted: true }) as Array<Finance>;
            const listJson = this.getListJson<Finance>({
                staging: FINANCE_LIST_STAGING_JSON,
                production: FINANCE_LIST_PRODUCTION_JSON,
                development: FINANCE_LIST_DEVELOPMENT_JSON
            });
            const added = financeList.filter((item) => !listJson.find((json) => json.id === item.id));
            const list = [...listJson, ...added];
            if(added.length > 0) {
                this.file.writeFile('finances.json', financeSeedsDir, list);
            }
            result.finances = { added, list};
        }

        if(seedsDto.income || seedsDto.incomeSource) {
            const {
                months: incomeMonths,
                incomes,
                incomeSources
            } = await this.incomeService.generateSeeds(Boolean(seedsDto.incomeSource), Boolean(seedsDto.income), financeSeedsDir);
            result.incomes = incomes;
            result.incomeSources = incomeSources;

            if(incomeMonths.list.length > 0) {
                result.months.list.push(...incomeMonths.list);
            }

            if(incomeMonths.added.length > 0) {
                result.months.added.push(...incomeMonths.added);
            }
        }

        if(seedsDto.group) {
            result.groups =  await this.groupService.generateSeeds(financeSeedsDir);
        }

        if(seedsDto.bill || seedsDto.expense) {
            const {
                bills,
                months: expenseMonths,
                expenses
            } = await this.billService.generateSeeds(Boolean(seedsDto.bill), Boolean(seedsDto.expense), financeSeedsDir);

            result.bills = bills;
            result.expenses = expenses;

            if(expenseMonths.list.length > 0) {
                result.months.list.push(...expenseMonths.list);
            }

            if(expenseMonths.added.length > 0) {
                result.months.added.push(...expenseMonths.added);
            }
        }

        if(result.months.added.length > 0) {
            this.file.writeFile('months.json', financeSeedsDir, result.months.list);
        }

        return result;
    }

    private validateFinanceSeedsDto(createFinanceSeedsDto: CreateFinanceSeedsDto) {
        const seedsDto = { ...createFinanceSeedsDto };
        if(createFinanceSeedsDto.income) {
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
}
