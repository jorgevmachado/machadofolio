import { Buffer } from 'buffer';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MONTHS } from '@repo/services/date/month/month';
import { Spreadsheet } from '@repo/services/spreadsheet/spreadsheet';
import type { TablesParams } from '@repo/services/spreadsheet/table/types';

import FinanceConstructor from '@repo/business/finance/finance';

import { Service } from '../shared';

import { User } from '../auth/entities/user.entity';

import { Bank } from './entities/bank.entity';
import { BankService } from './bank/bank.service';
import { Bill } from './entities/bill.entity';
import { BillService } from './bill/bill.service';
import { Expense } from './entities/expense.entity';
import { Finance } from './entities/finance.entity';
import { FinanceSeedsParams } from './types';
import { Group } from './entities/group.entity';
import { GroupService } from './group/group.service';
import { Supplier } from './entities/supplier.entity';
import { SupplierService } from './supplier/supplier.service';
import { SupplierType } from './entities/type.entity';

@Injectable()
export class FinanceService extends Service<Finance> {
    constructor(
        @InjectRepository(Finance)
        protected repository: Repository<Finance>,
        protected readonly bankService: BankService,
        protected readonly groupService: GroupService,
        protected readonly supplierService: SupplierService,
        protected readonly billService: BillService,
    ) {
        super('finances', [], repository);
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

    async generateDocument(user: User): Promise<Buffer> {
        const finance = this.validateFinance(user);
        const groups = await this.fetchGroups(finance.id);

        const sheet = new Spreadsheet();
        for (const group of groups) {
            sheet.createWorkSheet(group.name);

            sheet.cell.add({
                cell: 'B2',
                type: 'title',
                value: group.name,
                merge: { cellStart: 'B2', cellEnd: 'P11' }
            });

            const bills = await this.fetchBills(group.id);

            const data: TablesParams['tables'] = [];

            bills.forEach((bill) => {
                const expenses = bill.expenses ?? [];
                expenses.forEach((expense) => {
                    const monthlyData = MONTHS.map((month) => ({
                        month: month.toUpperCase(),
                        value: expense[month],
                        paid: expense[`${month}_paid`],
                    }));
                    const body = {
                        title: expense?.supplier?.name || 'expense',
                        data: monthlyData
                    }
                    data.push(body);
                })
            })

            sheet.addTables({
                tables: data,
                headers: ['month', 'value', 'paid'],
                bodyStyle: {
                    alignment: {
                        horizontal: 'center',
                        vertical: undefined,
                        wrapText: false,
                    },
                    borderStyle: 'thin',
                },
                titleStyle: {
                    font: { bold: true },
                    alignment: { wrapText: false },
                    borderStyle: 'medium',
                    fillColor: 'FFFFFF',
                },
                headerStyle: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: 'center',
                        vertical: undefined,
                        wrapText: false,
                    },
                    borderStyle: 'thin',
                },
                tableDataRows: MONTHS.length,
            })
        }

        return await sheet.generateSheetBuffer();
    }

    private validateFinance(user: User): Finance {
        if (!user?.finance) {
            throw new ConflictException('Finance not found');
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

    private async fetchBills(groupId: string) {
        return await this.billService.findAll({
            filters: [{
                value: groupId,
                param: 'group',
                condition: '='
            }],
            withRelations: true
        }) as Array<Bill>;
    }

    async seeds(financeSeedsParams: FinanceSeedsParams) {
        const finances = await this.seed(financeSeedsParams.financeListJson, financeSeedsParams.users) as Array<Finance>;
        const banks: Array<Bank> = await this.seeder.executeSeed<Bank>({
            label: 'Banks',
            seedMethod: async () => {
                const result = await this.bankService.seeds({ bankListJson: financeSeedsParams.bankListJson });
                return Array.isArray(result) ? result : [];
            }
        })
        const {
            supplierList,
            supplierTypeList
        } = await this.supplierService.seeds({
            supplierListJson: financeSeedsParams.supplierListJson,
            supplierTypeListJson: financeSeedsParams.supplierTypeListJson
        })
        const suppliers: Array<Supplier> = supplierList;
        const supplierTypes: Array<SupplierType> = supplierTypeList;

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

        const expenses: Array<Expense> = [];

        const bills: Array<Bill> = [];

        for (const finance of finances) {

            const billList = await this.seeder.executeSeed<Bill>({
                label: 'Bills',
                seedMethod: async () => {
                    const result = await this.billService.seeds({
                        finance,
                        banks,
                        groups,
                        billListJson: financeSeedsParams.billListJson,
                    });
                    return Array.isArray(result) ? result : [];
                },
            });
            bills.push(...billList);

            const expenseList = await this.seeder.executeSeed<Expense>({
                label: 'Expenses',
                seedMethod: async () => {
                    const result = await this.billService.expense.seeds({
                        bills: billList,
                        suppliers,
                        expenseListJson: financeSeedsParams.expenseListJson,
                    });
                    return Array.isArray(result) ? result : [];
                },
            });
            expenses.push(...expenseList);
        }

        return {
            bills: bills,
            groups: groups,
            banks: banks,
            expenses: expenses,
            finances: finances,
            suppliers: suppliers,
            supplierTypes: supplierTypes,
        }
    }

    private async seed(seedsJson: Array<unknown> = [], users: Array<User>) {
        return this.seeder.entities({
            by: 'id',
            key: 'all',
            label: 'Finance',
            seedsJson,
            withReturnSeed: true,
            createdEntityFn: async (entity) => {
                const user = users.find((item) => item.cpf === entity.user.cpf);
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
}
