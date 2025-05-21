import * as XLSX from 'xlsx';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { transformObjectDateAndNulls } from '@repo/services/object/object';

import FinanceConstructor from '@repo/business/finance/finance';

import { Service } from '../shared';

import { User } from '../auth/entities/user.entity';

import { Bank } from './entities/bank.entity';
import { BankService } from './bank/bank.service';
import { Bill } from './entities/bill.entity';
import { BillService } from './bill/bill.service';
import { CreateFinanceSeedsDto } from './dto/create-finance-seeds.dto';
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
    async generateDocument(user: User) {
        const groups = await this.billService.group.findAll({}) as Array<Group>;

        console.log('# => user => ', user)
        const finance = user.finance;
        if (finance) {
            finance.bills?.forEach((bill) => {
                console.log('# => bill => ', bill);
            })
        }

        // Criando o workbook
        const workbook = XLSX.utils.book_new();

        // Define os headers das planilhas
        const headers = ['name', 'name_code', 'created_at'];

        // Função para criar worksheet com formatação adequada
        const createWorksheet = (data: any[]) => {
            const ws = XLSX.utils.aoa_to_sheet(data);

            // Configurar largura das colunas
            ws['!cols'] = [
                { wch: 12 }, // DATA
                { wch: 40 }, // DESCRIÇÃO
                { wch: 15 }, // VALOR
                { wch: 20 }, // CATEGORIA
                { wch: 30 }  // OBSERVAÇÃO
            ];

            return ws;
        };

        groups.forEach((group) => {
            const data = [
                headers,
                [group.name, group.name_code, group.created_at]
            ];
            // Adicionar as planilhas ao workbook
            XLSX.utils.book_append_sheet(workbook, createWorksheet(data), group.name);
        });

        // Gerar o arquivo
        const excelBuffer = XLSX.write(workbook, {
            type: 'buffer',
            bookType: 'xlsx',
            compression: true
        });

        return excelBuffer;

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

        const groups: Array<Group> = [];

        const expenses: Array<Expense> = [];

        const bills: Array<Bill> = [];

        for (const finance of finances) {
            const groupList: Array<Group> = await this.seeder.executeSeed<Group>({
                label: 'Group',
                seedMethod: async () => {
                    const result = await this.groupService.seeds({
                        finance,
                        groupListJson: financeSeedsParams.groupListJson
                    });
                    return Array.isArray(result) ? result : [];
                }
            });
            groups.push(...groupList);

            const billList = await this.seeder.executeSeed<Bill>({
                label: 'Bills',
                seedMethod: async () => {
                    const result = await this.billService.seeds({
                        finance,
                        banks,
                        groups: groupList,
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

    private async seed(listJson: Array<unknown> = [], users: Array<User>, withReturnSeed = true) {
        const seeds = listJson.map((item) => transformObjectDateAndNulls<Finance, unknown>(item));
        console.info(`# => Start Finance seeding`);
        const existingEntities = await this.repository.find({ withDeleted: true });
        const existingEntitiesBy = new Set(
            existingEntities.map((entity) => entity.id),
        );

        const entitiesToCreate = seeds.filter(
            (entity) => !existingEntitiesBy.has(entity.id),
        );

        if (entitiesToCreate.length === 0) {
            console.info(`# => No new Finances to seed`);
            return existingEntities;
        }

        const createdEntities = (
            await Promise.all(
                entitiesToCreate.map(async (entity) => {
                    const user = users.find((item) => item.cpf === entity.user.cpf);
                    if (!user) {
                        return;
                    }
                    const finance = new FinanceConstructor({
                        ...entity,
                        user,
                        bills: undefined,
                    });
                    return this.save(finance);
                })
            )
        ).filter((entity) => !!entity);
        console.info(
            `# => Seeded ${createdEntities.length} new finance`,
        );
        const seed = [...existingEntities, ...createdEntities];
        if (!withReturnSeed) {
            return { message: `Seeding Finance Completed Successfully!` };
        }
        return seed;
    }

    // async seeds({
    //                 user,
    //                 bankListJson,
    //                 billListJson,
    //                 expenseListJson,
    //                 groupListJson,
    //                 supplierListJson,
    //                 supplierTypeListJson
    //             }: FinanceSeedsParams) {
    //     try {
    //         const finance = (await this.seed(user, {})) as Finance;
    //         const billList = await this.seeder.executeSeed<Bill>({
    //             label: 'Bills',
    //             seedMethod: async () => {
    //                 const result = await this.billService.seeds({
    //                     finance,
    //                     bankListJson,
    //                     groupListJson,
    //                     billListJson,
    //                 });
    //                 return Array.isArray(result) ? result : [];
    //             },
    //         });
    //
    //         await this.seeder.executeSeed<Expense>({
    //             label: 'Expenses',
    //             seedMethod: async () => {
    //                 const result = await this.billService.expense.seeds({
    //                     billList,
    //                     expenseListJson,
    //                     supplierListJson,
    //                     supplierTypeListJson,
    //                 });
    //                 return Array.isArray(result) ? result : [];
    //             },
    //         })
    //
    //         return {
    //             message: 'Seeds finances executed successfully',
    //         };
    //     } catch (error) {
    //         console.error('# => Error during seeds execution:', error);
    //         throw this.error(new ConflictException('Seed Execution Failed'));
    //     }
    // }
    //
    // private async seed(user: User, financeJson: unknown, withReturnSeed: boolean = true) {
    //     return await this.seeder.entity({
    //         by: 'id',
    //         seed: transformObjectDateAndNulls<Finance, unknown>(financeJson) as Finance,
    //         label: 'Finance',
    //         withReturnSeed,
    //         createdEntityFn: (item) => this.save({
    //             id: item.id,
    //             user: user,
    //             created_at: item.created_at,
    //             updated_at: item.updated_at,
    //             deleted_at: item.deleted_at
    //         }) as Promise<Finance>
    //     })
    // }
}
