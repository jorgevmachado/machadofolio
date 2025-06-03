import { Buffer } from 'buffer';


import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MONTHS } from '@repo/services/date/month/month';

import FinanceConstructor from '@repo/business/finance/finance';

import { Service, Sheet } from '../shared';

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


const BODY = [
    {
        month: 'january',
        value: 100,
        paid: true,
    },
    {
        month: 'February',
        value: 200,
        paid: false,
    },
    {
        month: 'March',
        value: 300,
        paid: true,
    },
    {
        month: 'April',
        value: 400,
        paid: false,
    },
    {
        month: 'May',
        value: 500,
        paid: true,
    },
    {
        month: 'June',
        value: 600,
        paid: false,
    },
    {
        month: 'July',
        value: 700,
        paid: true,
    },
    {
        month: 'August',
        value: 800,
        paid: false,
    },
    {
        month: 'September',
        value: 900,
        paid: true,
    },
    {
        month: 'October',
        value: 1000,
        paid: false,
    },
    {
        month: 'November',
        value: 1100,
        paid: true,
    },
    {
        month: 'December',
        value: 1200,
        paid: false,
    }
]

const TABLES = [
    { name: 'TABLE 1', data: BODY },
    { name: 'TABLE 2', data: BODY },
    { name: 'TABLE 3', data: BODY },
    { name: 'TABLE 4', data: BODY },
    { name: 'TABLE 5', data: BODY },
    { name: 'TABLE 6', data: BODY },
    { name: 'TABLE 7', data: BODY },
    { name: 'TABLE 8', data: BODY },
    { name: 'TABLE 9', data: BODY },
    { name: 'TABLE 10', data: BODY },
    { name: 'TABLE 11', data: BODY },
    { name: 'TABLE 12', data: BODY },
    { name: 'TABLE 13', data: BODY },
    { name: 'TABLE 14', data: BODY },
    { name: 'TABLE 15', data: BODY },
    { name: 'TABLE 16', data: BODY },
    { name: 'TABLE 17', data: BODY },
    { name: 'TABLE 18', data: BODY },
    { name: 'TABLE 19', data: BODY },
    { name: 'TABLE 20', data: BODY },
]

// const TABLES =  [
//     [
//         { name: 'TABLE 1', data: BODY },
//         { name: 'TABLE 2', data: BODY },
//         { name: 'TABLE 3', data: BODY },
//     ],
//     [
//         { name: 'TABLE 4', data: BODY },
//         { name: 'TABLE 5', data: BODY },
//         { name: 'TABLE 6', data: BODY },
//     ],
//     [
//         { name: 'TABLE 7', data: BODY },
//         { name: 'TABLE 8', data: BODY },
//         { name: 'TABLE 9', data: BODY },
//     ],
//     [
//         { name: 'TABLE 10', data: BODY },
//         { name: 'TABLE 11', data: BODY },
//         { name: 'TABLE 12', data: BODY },
//     ],
//     [
//         { name: 'TABLE 13', data: BODY },
//         { name: 'TABLE 14', data: BODY },
//         { name: 'TABLE 15', data: BODY },
//     ],
//     [
//         { name: 'TABLE 16', data: BODY },
//         { name: 'TABLE 17', data: BODY },
//         { name: 'TABLE 18', data: BODY },
//     ],
//     [
//         { name: 'TABLE 19', data: BODY },
//         { name: 'TABLE 20', data: BODY },
//     ]
// ]

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

    // async initializeWithDocument(file: Express.Multer.File, user: User) {
    //     console.log('# => user => ', user.id);
    //     try {
    //         const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    //
    //         const result = {};
    //
    //         workbook.SheetNames.forEach(sheetName => {
    //             const worksheet = workbook.Sheets[sheetName];
    //             if (worksheet) {
    //                 const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    //                     raw: true, // mantém os tipos originais (true) ou converte tudo para string (false)
    //                     defval: null, // valor padrão para células vazias
    //                     header: 'A', // Use 'A' para headers A,B,C ou 1 para números
    //                     range: 'A1:Z1000', // Define o range de células a ser lido
    //                     dateNF: 'yyyy-mm-dd', // Format para datas
    //                     blankrows: false, // Remove linhas vazias
    //                     rawNumbers: true, // Mantém os números como números
    //                 });
    //
    //               const transformedData = jsonData.map(row => {
    //                 // Aqui você pode transformar cada linha como precisar
    //                 return {
    //                   // Exemplo de transformação de campos
    //                   valor: typeof row?.['VALOR'] === 'number' ? Number(row['VALOR']).toFixed(2) : '0.00',
    //                   data: row?.['DATA'] ? new Date(row['DATA']) : null,
    //                   descricao: String(row?.['DESCRIÇÃO'] || '').trim(),
    //                   // Adicione campos calculados
    //                   mes: row?.['DATA'] ? new Date(row['DATA']).getMonth() + 1 : null,
    //                   // Pode adicionar campos condicionais
    //                   tipo: Number(row?.['VALOR']) > 0 ? 'receita' : 'despesa',
    //                 };
    //               });
    //
    //               // Opção 3: Filtrando dados inválidos
    //               const filteredData = transformedData.filter(row => {
    //                 return row.valor !== '0.00' && row.data !== null;
    //               });
    //
    //               // Opção 4: Agrupando dados
    //               const groupedData = filteredData.reduce((acc, curr) => {
    //                 const mes = curr.mes;
    //                 if(mes) {
    //                   if (!acc[mes]) {
    //                     acc[mes] = [];
    //                   }
    //                   acc[mes].push(curr);
    //                 }
    //                 return acc;
    //               }, {});
    //               result[sheetName] = {
    //                 raw: jsonData, // dados originais
    //                 transformed: transformedData, // dados transformados
    //                 filtered: filteredData, // dados filtrados
    //                 grouped: groupedData // dados agrupados
    //               };
    //             }
    //         });
    //
    //         console.log('# => result => ingrid => ', result['INGRID'])
    //
    //         // const creditos = result['CREDITO'].filter((item) => item['CARTÃO DE CREDITO'] !== null);
    //         // const ingrid = result['INGRID'].filter((item) => item['INGRID'] !== null);
    //         // ingrid.forEach(sheet => {
    //         //   console.log('# => ingrid => ', sheet);
    //         // })
    //
    //
    //         // const processedData = {
    //         //   fileName: file.originalname,
    //         //   fileSize: file.size,
    //         //   sheets: result,
    //         //   totalSheets: workbook.SheetNames.length,
    //         //   sheetNames: workbook.SheetNames
    //         // };
    //         //
    //         //
    //         // console.log('# => processedData => ', processedData);
    //     } catch (error) {
    //         throw new Error(`Erro ao processar o documento: ${error}`);
    //
    //     }
    //     return {
    //         message: 'Successfully initialized'
    //     }
    // }
    //

    // async generateDocument(user: User): Promise<Buffer> {
    //     const finance = this.validateFinance(user);
    //     const groups = await this.fetchGroups(finance.id);
    //
    //     const sheetBuilder = new Sheet();
    //
    //     await Promise.all(groups.map(group => this.processGroup(group, sheetBuilder)));
    //
    //     return sheetBuilder.workBook.generateWorkBook();
    // }


    async generateDocument(user: User): Promise<Buffer> {
        const sheet = new Sheet();
        sheet.createWorkSheet('Planilha 1');

        sheet.cell.add({
            cell: 'B2',
            type: 'title',
            value: 'TITULO',
            merge: { cellStart: 'B2', cellEnd: 'P11' }
        });

        sheet.addTables({
            tables: TABLES,
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
                fillColor: 'FFDDEE',
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

        return await sheet.generateSheetBuffer();
    }


    // private async processGroup(group: Group, sheet: Sheet) {
    //     const bills = await this.fetchBills(group.id);
    //     const tableConfig: TableConfig = {
    //         width: 4,
    //         fontSize: 12,
    //         rowHeight: 14,
    //         initialRow: 13,
    //         tablesPerRow: 3,
    //     };
    //
    //     sheet.createWorkSheet(1000, 15);
    //
    //     sheet.workSheet.addTitle({
    //         value: group.name || '',
    //         label: 'B2',
    //         mergePosition: { startRow: 1, startColumn: 1, endRow: 10, endColumn: 14 }
    //     });
    //
    //     bills.reduce((currentRow, bill) => this.processExpenses(bill.expenses ?? [], currentRow, sheet, tableConfig), tableConfig.initialRow);
    //
    //     sheet.workBook.addToWorkBook(sheet.workSheet.workSheet, group.name)
    // }
    //
    // private processExpenses(expenses: Array<Expense>, startRow: number, sheet: Sheet, tableConfig: TableConfig ): number {
    //     const defaultStyles = { font: { sz: 12 } };
    //
    //     return expenses.reduce((acc, expense, index) => {
    //         const monthlyData = MONTHS.map((month) => ({
    //             month: month.toUpperCase(),
    //             value: expense[month],
    //             paid: expense[`${month}_paid`],
    //         }));
    //         return sheet.workSheet.AddTable({
    //             body: monthlyData,
    //             index,
    //             title: expense?.supplier?.name,
    //             config: tableConfig,
    //             headers: ['month', 'value', 'paid'],
    //             tableStyle: {
    //                 body: {
    //                     ...defaultStyles,
    //                     borderStyle: 'thin'
    //                 },
    //                 header: {
    //                     ...defaultStyles,
    //                     borderStyle: 'thin'
    //                 },
    //                 title: defaultStyles,
    //
    //             },
    //             currentRow: acc,
    //         })
    //     }, startRow)
    //
    //
    // }


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
