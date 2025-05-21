import * as XLSX from 'xlsx';

import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

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
    //     const finance = user?.finance;
    //     if (!finance) {
    //         throw new ConflictException('Error');
    //     }
    //     const groups = await this.groupService.findAll({
    //         filters: [{
    //             value: finance.id,
    //             param: 'finance',
    //             condition: '='
    //         }],
    //         withRelations: true
    //     }) as Array<Group>;
    //
    //     const workbook = XLSX.utils.book_new();
    //
    //     for (const group of groups) {
    //         const bills = await this.billService.findAll({
    //             filters: [{
    //                 value: group.id,
    //                 param: 'group',
    //                 condition: '='
    //             }],
    //             withRelations: true
    //         }) as Array<Bill>;
    //
    //         // Aumentar o tamanho inicial da matriz para comportar todos os dados
    //         const initialData = Array(1000).fill(null).map(() => Array(15).fill(''));
    //         const ws = XLSX.utils.aoa_to_sheet(initialData);
    //
    //         // Configurar larguras das colunas uma única vez
    //         ws['!cols'] = Array(15).fill({ wch: 15 });
    //
    //         // Configurar alturas das linhas uma única vez
    //         ws['!rows'] = Array(1000).fill({ hpt: 30 });
    //
    //         // Configurar a mesclagem inicial
    //         ws['!merges'] = [{
    //             s: { r: 1, c: 1 },
    //             e: { r: 10, c: 14 }
    //         }];
    //
    //         // Título principal do grupo
    //         ws['B2'] = {
    //             v: String(group.name || ''),
    //             t: 's',
    //             s: {
    //                 font: { sz: 14, bold: true, name: 'Arial' },
    //                 alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
    //                 border: {
    //                     top: { style: 'medium' },
    //                     bottom: { style: 'medium' },
    //                     left: { style: 'medium' },
    //                     right: { style: 'medium' }
    //                 }
    //             }
    //         };
    //
    //         let currentRow = 13;
    //
    //         for (const bill of bills) {
    //             // Título da bill
    //             ws[XLSX.utils.encode_cell({ r: currentRow, c: 1 })] = {
    //                 v: String(bill.type || ''),
    //                 t: 's',
    //                 s: {
    //                     font: { sz: 12, bold: true, name: 'Arial' },
    //                     alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
    //                     border: {
    //                         top: { style: 'medium' },
    //                         bottom: { style: 'medium' },
    //                         left: { style: 'medium' },
    //                         right: { style: 'medium' }
    //                     }
    //                 }
    //             };
    //
    //             ws['!merges'].push({
    //                 s: { r: currentRow, c: 1 },
    //                 e: { r: currentRow, c: 4 }
    //             });
    //             currentRow += 2;
    //
    //             if (bill.expenses) {
    //                 for (const expense of bill.expenses) {
    //                     // Título do fornecedor
    //                     ws[XLSX.utils.encode_cell({ r: currentRow, c: 1 })] = {
    //                         v: String(expense.supplier.name || ''),
    //                         t: 's',
    //                         s: {
    //                             font: { sz: 12, bold: true, name: 'Arial' },
    //                             alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
    //                             border: {
    //                                 top: { style: 'medium' },
    //                                 bottom: { style: 'medium' },
    //                                 left: { style: 'medium' },
    //                                 right: { style: 'medium' }
    //                             }
    //                         }
    //                     };
    //
    //                     ws['!merges'].push({
    //                         s: { r: currentRow, c: 1 },
    //                         e: { r: currentRow, c: 4 }
    //                     });
    //                     currentRow += 1;
    //
    //                     // Headers da tabela mensal
    //                     const headers = ['month', 'value', 'pay'];
    //                     headers.forEach((header, index) => {
    //                         ws[XLSX.utils.encode_cell({ r: currentRow, c: index + 1 })] = {
    //                             v: header,
    //                             t: 's',
    //                             s: {
    //                                 font: { bold: true, name: 'Arial' },
    //                                 alignment: { horizontal: 'center' },
    //                                 border: {
    //                                     top: { style: 'thin' },
    //                                     bottom: { style: 'thin' },
    //                                     left: { style: 'thin' },
    //                                     right: { style: 'thin' }
    //                                 }
    //                             }
    //                         };
    //                     });
    //                     currentRow++;
    //
    //                     // Dados mensais
    //                     const monthlyData = this.generateExpenseData(expense);
    //
    //                     monthlyData.forEach((row) => {
    //                         row.forEach((cell, colIndex) => {
    //                             ws[XLSX.utils.encode_cell({ r: currentRow, c: colIndex + 1 })] = {
    //                                 v: cell,
    //                                 t: 's',
    //                                 s: {
    //                                     alignment: { horizontal: 'center' },
    //                                     border: {
    //                                         top: { style: 'thin' },
    //                                         bottom: { style: 'thin' },
    //                                         left: { style: 'thin' },
    //                                         right: { style: 'thin' }
    //                                     }
    //                                 }
    //                             };
    //                         });
    //                         currentRow++;
    //                     });
    //
    //                     currentRow += 2; // Espaço extra após cada tabela
    //                 }
    //             }
    //             currentRow += 2; // Espaço extra após cada bill
    //         }
    //
    //         // Adicionar a planilha ao workbook
    //         XLSX.utils.book_append_sheet(workbook, ws, String(group.name || 'Sheet'));
    //     }
    //
    //     // Gerar o arquivo
    //     return XLSX.write(workbook, {
    //         type: 'buffer',
    //         bookType: 'xlsx',
    //         compression: true,
    //         cellStyles: true
    //     });
    // }

    async generateDocument(user: User): Promise<Buffer> {
        const finance = user?.finance;
        if (!finance) {
            throw new ConflictException('Error');
        }
        const groups = await this.groupService.findAll({
            filters: [{
                value: finance.id,
                param: 'finance',
                condition: '='
            }],
            withRelations: true
        }) as Array<Group>;

        const workbook = XLSX.utils.book_new();

        for (const group of groups) {
            const bills = await this.billService.findAll({
                filters: [{
                    value: group.id,
                    param: 'group',
                    condition: '='
                }],
                withRelations: true
            }) as Array<Bill>;

            // Aumentar o tamanho inicial da matriz para comportar todos os dados
            const initialData = Array(1000).fill(null).map(() => Array(15).fill(''));
            const ws = XLSX.utils.aoa_to_sheet(initialData);

            // Configurar larguras das colunas uma única vez
            ws['!cols'] = Array(15).fill({ wch: 15 });

            // Configurar alturas das linhas uma única vez
            ws['!rows'] = Array(1000).fill({ hpt: 30 });

            // Configurar a mesclagem inicial
            ws['!merges'] = [{
                s: { r: 1, c: 1 },
                e: { r: 10, c: 14 }
            }];

            // Título principal do grupo
            ws['B2'] = {
                v: String(group.name || ''),
                t: 's',
                s: {
                    font: { sz: 14, bold: true, name: 'Arial' },
                    alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
                    border: {
                        top: { style: 'medium' },
                        bottom: { style: 'medium' },
                        left: { style: 'medium' },
                        right: { style: 'medium' }
                    }
                }
            };

            let currentRow = 13;

            for (const bill of bills) {
                if (bill.expenses) {
                    let currentCol = 1;
                    const tableWidth = 4;
                    const tablesPerRow = 3;
                    let tableCount = 0;
                    let baseRow = currentRow;
                    const rowHeight = 14; // Altura fixa baseada no número de meses (12) + headers (2)

                    for (const expense of bill.expenses) {
                        // Título do fornecedor
                        ws[XLSX.utils.encode_cell({ r: baseRow, c: currentCol })] = {
                            v: String(expense.supplier.name || ''),
                            t: 's',
                            s: {
                                font: { sz: 12, bold: true, name: 'Arial' },
                                alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
                                border: {
                                    top: { style: 'medium' },
                                    bottom: { style: 'medium' },
                                    left: { style: 'medium' },
                                    right: { style: 'medium' }
                                }
                            }
                        };

                        // Mesclagem do título do fornecedor
                        ws['!merges'].push({
                            s: { r: baseRow, c: currentCol },
                            e: { r: baseRow, c: currentCol + 2 }
                        });

                        // Headers da tabela
                        const headers = ['month', 'value', 'pay'];
                        headers.forEach((header, index) => {
                            ws[XLSX.utils.encode_cell({ r: baseRow + 1, c: currentCol + index })] = {
                                v: header,
                                t: 's',
                                s: {
                                    font: { bold: true, name: 'Arial' },
                                    alignment: { horizontal: 'center' },
                                    border: {
                                        top: { style: 'thin' },
                                        bottom: { style: 'thin' },
                                        left: { style: 'thin' },
                                        right: { style: 'thin' }
                                    }
                                }
                            };
                        });

                        // Dados mensais específicos para cada expense
                        const monthlyData = [
                            ['JANEIRO', String(expense.january || '0'), String(expense.january_paid ? 'SIM' : 'NÃO')],
                            ['FEVEREIRO', String(expense.february || '0'), String(expense.february_paid ? 'SIM' : 'NÃO')],
                            ['MARÇO', String(expense.march || '0'), String(expense.march_paid ? 'SIM' : 'NÃO')],
                            ['ABRIL', String(expense.april || '0'), String(expense.april_paid ? 'SIM' : 'NÃO')],
                            ['MAIO', String(expense.may || '0'), String(expense.may_paid ? 'SIM' : 'NÃO')],
                            ['JUNHO', String(expense.june || '0'), String(expense.june_paid ? 'SIM' : 'NÃO')],
                            ['JULHO', String(expense.july || '0'), String(expense.july_paid ? 'SIM' : 'NÃO')],
                            ['AGOSTO', String(expense.august || '0'), String(expense.august_paid ? 'SIM' : 'NÃO')],
                            ['SETEMBRO', String(expense.september || '0'), String(expense.september_paid ? 'SIM' : 'NÃO')],
                            ['OUTUBRO', String(expense.october || '0'), String(expense.october_paid ? 'SIM' : 'NÃO')],
                            ['NOVEMBRO', String(expense.november || '0'), String(expense.november_paid ? 'SIM' : 'NÃO')],
                            ['DEZEMBRO', String(expense.december || '0'), String(expense.december_paid ? 'SIM' : 'NÃO')]
                        ];

                        monthlyData.forEach((row, rowIndex) => {
                            row.forEach((cell, colIndex) => {
                                ws[XLSX.utils.encode_cell({ r: baseRow + 2 + rowIndex, c: currentCol + colIndex })] = {
                                    v: cell,
                                    t: 's',
                                    s: {
                                        alignment: { horizontal: 'center' },
                                        border: {
                                            top: { style: 'thin' },
                                            bottom: { style: 'thin' },
                                            left: { style: 'thin' },
                                            right: { style: 'thin' }
                                        }
                                    }
                                };
                            });
                        });

                        // Ajusta a posição para a próxima tabela
                        tableCount++;
                        if (tableCount % tablesPerRow === 0) {
                            currentCol = 1;
                            baseRow += rowHeight;
                        } else {
                            currentCol += tableWidth;
                        }
                    }

                    // Atualiza currentRow para a próxima bill
                    currentRow = baseRow + rowHeight;
                }
            }

            // Adicionar a planilha ao workbook
            XLSX.utils.book_append_sheet(workbook, ws, String(group.name || 'Sheet'));
        }

        // Gerar o arquivo
        return XLSX.write(workbook, {
            type: 'buffer',
            bookType: 'xlsx',
            compression: true,
            cellStyles: true
        });
    }

    private generateExpenseData(expense: Expense) {
        return [
            ['JANUARY', String(expense.january || '0'), String(expense.january_paid ? 'YES' : 'NO')],
            ['february', String(expense.february || '0'), String(expense.february_paid ? 'YES' : 'NO')],
            ['march', String(expense.march || '0'), String(expense.march_paid ? 'YES' : 'NO')],
            ['april', String(expense.april || '0'), String(expense.april_paid ? 'YES' : 'NO')],
            ['may', String(expense.may || '0'), String(expense.may_paid ? 'YES' : 'NO')],
            ['june', String(expense.june || '0'), String(expense.june_paid ? 'YES' : 'NO')],
            ['july', String(expense.july || '0'), String(expense.july_paid ? 'YES' : 'NO')],
            ['august', String(expense.august || '0'), String(expense.august_paid ? 'YES' : 'NO')],
            ['september', String(expense.september || '0'), String(expense.september_paid ? 'YES' : 'NO')],
            ['october', String(expense.october || '0'), String(expense.october_paid ? 'YES' : 'NO')],
            ['november', String(expense.november || '0'), String(expense.november_paid ? 'YES' : 'NO')],
            ['december', String(expense.december || '0'), String(expense.december_paid ? 'YES' : 'NO')],
        ]
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
