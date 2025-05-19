import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { transformObjectDateAndNulls } from '@repo/services/object/object';

import FinanceConstructor from '@repo/business/finance/finance';

import BANK_LIST_FIXTURE_JSON from '@repo/mock-json/finance/bank/banks.json';
import BILL_LIST_FIXTURE_JSON from '@repo/mock-json/finance/bill/bills.json';
import BILL_CATEGORY_LIST_FIXTURE_JSON from '@repo/mock-json/finance/bill-category/bill-categories.json';
import EXPENSE_LIST_FIXTURE_JSON from '@repo/mock-json/finance/expense/expenses.json';
import FINANCE_FIXTURE_JSON from '@repo/mock-json/finance/finance.json';
import SUPPLIER_LIST_FIXTURE_JSON from '@repo/mock-json/finance/supplier/suppliers.json';
import SUPPLIER_TYPE_LIST_FIXTURE_JSON from '@repo/mock-json/finance/supplier-type/supplier-types.json';


import { Service } from '../shared';

import { Finance } from './entities/finance.entity';
import { User } from '../auth/entities/user.entity';

import { BillService } from './bill/bill.service';
import { Bill } from './entities/bill.entity';
import { Expense } from './entities/expense.entity';
import { FinanceSeederParams } from './types';

type FinanceSeedsParams = FinanceSeederParams & {
    user: User;
}

@Injectable()
export class FinanceService extends Service<Finance> {
    constructor(
        @InjectRepository(Finance)
        protected repository: Repository<Finance>,
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
    // generateDocument(user: User) {
    //     console.log('# => user => ', user)
    //     const finance = user.finance;
    //     if(finance) {
    //         finance.bills?.forEach((bill) => {
    //             console.log('# => bill => ', bill);
    //         })
    //     }
    //
    //     // Criando o workbook
    //     const workbook = XLSX.utils.book_new();
    //
    //     // Define os headers das planilhas
    //     const headers = ['DATA', 'DESCRIÇÃO', 'VALOR', 'CATEGORIA', 'OBSERVAÇÃO'];
    //
    //
    //     const creditoData = [
    //         headers,
    //         ['2024-01-01', 'Exemplo Cartão de Crédito', '-100.00', 'Compras', 'Parcela 1/12']
    //     ];
    //
    //     const ingridData = [
    //         headers,
    //         ['2024-01-01', 'Exemplo Residencial Ingrid', '1000.00', 'Aluguel', 'Inquilino João']
    //     ];
    //
    //     const monteCarloData = [
    //         headers,
    //         ['2024-01-01', 'Exemplo Monte Carlo', '1200.00', 'Aluguel', 'Inquilino Maria']
    //     ];
    //
    //     const maeData = [
    //         headers,
    //         ['2024-01-01', 'Exemplo Mãe', '-50.00', 'Mercado', 'Compras do mês']
    //     ];
    //
    //     // Função para criar worksheet com formatação adequada
    //     const createWorksheet = (data: any[]) => {
    //         const ws = XLSX.utils.aoa_to_sheet(data);
    //
    //         // Configurar largura das colunas
    //         ws['!cols'] = [
    //             { wch: 12 }, // DATA
    //             { wch: 40 }, // DESCRIÇÃO
    //             { wch: 15 }, // VALOR
    //             { wch: 20 }, // CATEGORIA
    //             { wch: 30 }  // OBSERVAÇÃO
    //         ];
    //
    //         return ws;
    //     };
    //
    //
    //
    //     // Adicionar as planilhas ao workbook
    //     XLSX.utils.book_append_sheet(workbook, createWorksheet(creditoData), 'Credito');
    //     XLSX.utils.book_append_sheet(workbook, createWorksheet(ingridData), 'Residencial Ingrid');
    //     XLSX.utils.book_append_sheet(workbook, createWorksheet(monteCarloData), 'Residencial Monte Carlo');
    //     XLSX.utils.book_append_sheet(workbook, createWorksheet(maeData), 'Mãe');
    //
    //
    //     // Gerar o arquivo
    //     const excelBuffer = XLSX.write(workbook, {
    //         type: 'buffer',
    //         bookType: 'xlsx',
    //         compression: true
    //     });
    //
    //     return excelBuffer;
    //
    // }

    async seeds({
                    user,
                    bankListJson = BANK_LIST_FIXTURE_JSON,
                    billListJson = BILL_LIST_FIXTURE_JSON,
                    expenseListJson = EXPENSE_LIST_FIXTURE_JSON,
                    categoryListJson = BILL_CATEGORY_LIST_FIXTURE_JSON,
                    supplierListJson = SUPPLIER_LIST_FIXTURE_JSON,
                    supplierTypeListJson = SUPPLIER_TYPE_LIST_FIXTURE_JSON
                }: FinanceSeedsParams) {
        try {
            const finance = (await this.seed(user)) as Finance;
            const billList = await this.seeder.executeSeed<Bill>({
                label: 'Bills',
                seedMethod: async () => {
                    const result = await this.billService.seeds({
                        finance,
                        bankListJson,
                        categoryListJson,
                        billListJson,
                    });
                    return Array.isArray(result) ? result : [];
                },
            });

            await this.seeder.executeSeed<Expense>({
                label: 'Expenses',
                seedMethod: async () => {
                    const result = await this.billService.expenseSeeds({
                        billList,
                        expenseListJson,
                        supplierListJson,
                        supplierTypeListJson,
                    });
                    return Array.isArray(result) ? result : [];
                },
            })

            return {
                message: 'Seeds finances executed successfully',
            };
        } catch (error) {
            console.error('# => Error during seeds execution:', error);
            throw this.error(new ConflictException('Seed Execution Failed'));
        }
    }

    private async seed(user: User, withReturnSeed: boolean = true) {
        return await this.seeder.entity({
            by: 'id',
            seed: transformObjectDateAndNulls<Finance, unknown>(FINANCE_FIXTURE_JSON) as Finance,
            label: 'Finance',
            withReturnSeed,
            createdEntityFn: (item) => this.save({
                id: item.id,
                user: user,
                created_at: item.created_at,
                updated_at: item.updated_at,
                deleted_at: item.deleted_at
            }) as Promise<Finance>
        })
    }

}
