import * as ExcelJS from 'exceljs';

import { Buffer } from 'buffer';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Spreadsheet } from '@repo/services/spreadsheet/spreadsheet';

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

type SpreadsheetTable = {
    title: string;
    january: string | number;
    february: string | number;
    march: string | number;
    april: string | number;
    may: string | number;
    june: string | number;
    july: string | number;
    august: string | number;
    september: string | number;
    october: string | number;
    november: string | number;
    december: string | number;
    paid: string | number;
    total: string | number;
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
    ) {
        super('finances', ['bills', 'bills.expenses'], repository);
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
        const groupsName: Array<string> = groups.map((group) => group.name);

        await Promise.all(
            groups.map(group => this.billService.spreadsheetProcessing({
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

        const addedBillIds = new Set<string>();
        const bills: Array<Bill> = [];

        const addedExpenseIds = new Set<string>();
        const expenses: Array<Expense> = [];

        const financeListSeed = this.seeder.currentSeeds<Finance>({ seedsJson: financeSeedsParams.financeListJson });

        for (const finance of finances) {
            const financeSeed = financeListSeed.find((item) => item.id === finance.id);
            if (financeSeed) {
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

    async initializeWithDocument(file: Express.Multer.File, user: User) {
        if (!file?.buffer) {
            throw new Error('Arquivo não enviado ou inválido.');
        }
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);

        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            throw new Error('O arquivo Excel não contém nenhuma planilha.');
        }

        const headerRowNumber = 14;
        const headerRow = worksheet.getRow(headerRowNumber);

        if (!headerRow) {
            throw new Error('Cabeçalho ausente na planilha.');
        }

        const headerMap: { [col: number]: keyof SpreadsheetTable } = {};
        headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            const header = String(cell.value).trim().toLowerCase();
            // Relacionamento defensivo para prevenir erros de capitalização
            switch (header) {
                case 'title': headerMap[colNumber] = 'title'; break;
                case 'january': headerMap[colNumber] = 'january'; break;
                case 'february': headerMap[colNumber] = 'february'; break;
                case 'march': headerMap[colNumber] = 'march'; break;
                case 'april': headerMap[colNumber] = 'april'; break;
                case 'may': headerMap[colNumber] = 'may'; break;
                case 'june': headerMap[colNumber] = 'june'; break;
                case 'july': headerMap[colNumber] = 'july'; break;
                case 'august': headerMap[colNumber] = 'august'; break;
                case 'september': headerMap[colNumber] = 'september'; break;
                case 'october': headerMap[colNumber] = 'october'; break;
                case 'november': headerMap[colNumber] = 'november'; break;
                case 'december': headerMap[colNumber] = 'december'; break;
                case 'paid': headerMap[colNumber] = 'paid'; break;
                case 'total': headerMap[colNumber] = 'total'; break;
                // Adicione outras opções conforme necessário
            }
        });

        const data: SpreadsheetTable[] = [];

        for (
            let rowNumber = headerRowNumber + 1;
            rowNumber <= worksheet.rowCount;
            rowNumber++
        ) {
            const row = worksheet.getRow(rowNumber);
            if (!row) break;

            let rowIsEmpty = true;
            const obj: Partial<SpreadsheetTable> = {};

            for (const col in headerMap) {
                const colNum = parseInt(col, 10);
                const key = headerMap[colNum];
                const value = row.getCell(colNum).value;

                if (value !== null && value !== undefined && value !== '') {
                    rowIsEmpty = false;
                }
                if(key) {
                    obj[key] = (typeof value === 'object' && value !== null && 'result' in value) ? (value as any).result : value ?? '';
                }
            }

            if (rowIsEmpty) break;

            // Faz um cast porque testamos todos os campos no começo.
            data.push(obj as SpreadsheetTable);
        }

        return data;

    }
}
