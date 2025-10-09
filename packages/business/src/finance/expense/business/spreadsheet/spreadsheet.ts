import {
    cleanTextByListText,
    CycleOfMonths,
    DEFAULT_TABLES_PARAMS,
    EMonth,
    Error,
    ERROR_STATUS_CODE,
    getMonthByIndex,
    matchesRepeatWords,
    MONTHS,
    replaceWords,
    ReplaceWordsParam,
    snakeCaseToNormal,
    TablesParams,
    WorkSheet
} from '@repo/services';

import { Bill, EBillType } from '../../../bill';

import Expense from '../../expense';

import type { CreateExpenseParams, UploadExpenseParams } from '../../types';

import {
    AccumulateGroupTables,
    AccumulateGroupTablesParams,
    BuildCreditCardBodyData,
    BuildCreditCardBodyDataParams,
    BuildDetailData,
    BuildDetailDataParams,
    BuildFromCreditCardSheet,
    BuildGroupTable,
    BuildGroupTableParams,
    DataAccumulator,
    GenerateCreditCardTable,
    GenerateCreditCardTableParams,
    GenerateDetailsTable,
    GenerateDetailsTableParams,
    ParseToDetailsTable,
    ParseToDetailsTableParams,
    ValidateWorkSheetToBuild
} from './types';

const DEFAULT_REPLACE_WORDS: ReplaceWordsParam = [
    {
        after: 'Pão de Açúcar',
        before: 'Pao de Acucar',
    }
];

const DEFAULT_REPEAT_WORDS: Array<string> = [
    'Pagamento recebido',
    'Estorno de *'
];

export default class SpreadsheetBusiness {
    public buildTablesParams(expenses: Array<Expense> = [], tableWidth: number, headers: Array<string> = ['month', 'value', 'paid']): TablesParams {
        const tables: TablesParams['tables'] = [];

        expenses.forEach((expense) => {
            const monthlyData = expense.months.map((month) => ({
                month: month.label,
                value: month.value,
                paid: month.paid,
            }));
            const body = {
                title: expense?.supplier?.name || 'expense',
                data: monthlyData
            };
            tables.push(body);
        });

        return {
            ...DEFAULT_TABLES_PARAMS,
            tables,
            headers,
            tableWidth,
            tableDataRows: MONTHS.length,
        };
    }

    private buildDetailData({
                                row,
                                cell,
                                bill,
                                column,
                                workSheet,
                            }: BuildDetailDataParams): BuildDetailData | undefined {
        const title = cell.value ? cell.value.toString().trim() : '';
        if (title === '') {
            return;
        }

        const bodyData = MONTHS.reduce((acc, month, index) => {
            const valueCell = workSheet.cell(row + index, column);
            const valueText = valueCell.value ? valueCell.value.toString().trim() : '0';
            const paidCell = workSheet.cell(row + index, column + 1);
            const paidText = paidCell.value ? paidCell.value.toString().trim() : 'NO';
            return {
                ...acc,
                [month]: Number(valueText),
                [`${month}_paid`]: paidText === 'YES'
            };
        }, {} as CycleOfMonths);

        return {
            ...bodyData,
            bill,
            supplier: title
        };
    }

    private buildGroupTable({ row, bill, workSheet }: BuildGroupTableParams): BuildGroupTable {
        const tableCell1 = workSheet.cell(row, 3);
        if (tableCell1.isMerged && tableCell1['_mergeCount'] === 2) {
            const groupTableData: Array<Record<string, string | number | boolean | object | Bill>> = [];
            const groupTableRow = row + 2;
            const groupTable1Data1 = this.buildDetailData({
                row: groupTableRow,
                cell: tableCell1,
                bill,
                column: 4,
                workSheet,
            });
            if (groupTable1Data1) {
                groupTableData.push(groupTable1Data1);
            }
            const tableCell2 = workSheet.cell(row, 8);
            const groupTable1Data2 = this.buildDetailData({
                row: groupTableRow,
                cell: tableCell2,
                bill,
                column: 9,
                workSheet,
            });
            if (groupTable1Data2) {
                groupTableData.push(groupTable1Data2);
            }

            const tableCell3 = workSheet.cell(row, 13);
            const groupTable1Data3 = this.buildDetailData({
                row: groupTableRow,
                cell: tableCell3,
                bill,
                column: 14,
                workSheet,
            });
            if (groupTable1Data3) {
                groupTableData.push(groupTable1Data3);
            }
            return { data: groupTableData, nextRow: row + 12 + 1 + 1 + 1, hasNext: true };
        }

        return { data: [], nextRow: row, hasNext: false };

    }

    private accumulateGroupTables({
                                      acc,
                                      bill,
                                      startRow,
                                      workSheet
                                  }: AccumulateGroupTablesParams): AccumulateGroupTables {
        const constructedGroupTable = this.buildGroupTable({
            row: startRow,
            bill,
            workSheet,
        });
        const updatedAcc = [...acc, ...constructedGroupTable.data];
        if (constructedGroupTable.hasNext) {
            return this.accumulateGroupTables({
                acc: updatedAcc,
                bill,
                startRow: constructedGroupTable.nextRow,
                workSheet
            });
        }
        return { acc: updatedAcc, lastRow: constructedGroupTable.nextRow };
    }

    private generateDetailsTable({ bills, startRow, workSheet }: GenerateDetailsTableParams): GenerateDetailsTable {
        const billTypeMap = new Map(bills.map(bill => [bill.type, bill]));
        const collectGroupsRecursively = (row: number, acc: DataAccumulator): {
            data: DataAccumulator;
            nextRow: number
        } => {
            const cell = workSheet.cell(row, 3);
            const type = cell?.value ? cell?.value?.toString()?.trim() : '';

            if (!type) {
                return { data: acc, nextRow: row };
            }

            const bill = billTypeMap.get(type as Bill['type']);

            if (!bill) {
                return { data: acc, nextRow: row };
            }

            const { acc: filledAcc, lastRow } = this.accumulateGroupTables({
                acc,
                bill,
                startRow: row + 1,
                workSheet,
            });

            return collectGroupsRecursively(lastRow, filledAcc);
        };

        const { data, nextRow } = collectGroupsRecursively(startRow, []);

        return { data, nextRow };
    }

    private buildCreditCardBodyData({
                                        row,
                                        bill,
                                        column,
                                        isParent = true,
                                        groupName,
                                        workSheet,
                                        supplierList = []
                                    }: BuildCreditCardBodyDataParams): BuildCreditCardBodyData {
        const filterTexts: Array<string> = [
            bill.name,
            ...(!isParent ? supplierList : [])
        ];

        const titleCellTable = workSheet.cell(row, column);
        const titleCellTableValue = titleCellTable.value ? titleCellTable.value.toString().trim() : '';

        const name = `${groupName} ${titleCellTableValue}`;

        const monthsObj = MONTHS.reduce((acc, month) => {
            acc[month] = 0;
            acc[`${month}_paid`] = false;
            return acc;
        }, {} as CycleOfMonths);

        const supplier = cleanTextByListText(filterTexts, name);

        const normalizedSupplierList = isParent ? [supplier] : [];

        const monthValues = MONTHS.map((month, index) => {
            const currentColumn = column + 1 + index;
            const monthCell = workSheet.cell(row, currentColumn);
            const monthCellValue = monthCell?.value ? monthCell?.value?.toString()?.trim() : '0';
            const monthCellValueNumber = Number(monthCellValue);
            return { [month]: Number.isNaN(monthCellValueNumber) ? 0 : monthCellValueNumber };
        });

        const paidColumn = column + 1 + MONTHS.length;
        const paidCell = workSheet.cell(row, paidColumn);
        const paidCellValue = paidCell?.value ? paidCell?.value?.toString()?.trim() : 'NO';
        const paid = paidCellValue === 'YES';

        const paidMonths = MONTHS.reduce((acc, month) => {
            acc[`${month}_paid`] = paid;
            return acc;
        }, {} as Record<string, boolean>);

        const totalColumn = paidColumn + 1;
        const totalCell = workSheet.cell(row, totalColumn);
        const totalCellValue = totalCell?.value ? totalCell?.value?.toString()?.trim() : '0';
        const total = Number(totalCellValue) || 0;

        const monthValuesObj = Object.assign({}, ...monthValues);

        const bodyData = {
            ...monthsObj,
            ...monthValuesObj,
            ...paidMonths,
            year: bill.year,
            bill,
            name,
            supplier,
            is_aggregate: !isParent,
            aggregate_name: cleanTextByListText([bill.name, supplier], name) ?? '',
            paid,
            total
        };

        return { data: bodyData, supplierList: normalizedSupplierList };
    }

    private generateCreditCardTable({
                                        bills,
                                        startRow,
                                        groupName,
                                        workSheet
                                    }: GenerateCreditCardTableParams): GenerateCreditCardTable {
        const regex = /^([A-Z_]+)\(([^)]+)\)$/;

        const readExpensesBlock = (
            bill: Bill,
            supplierList: Array<string>,
            currentRow: number,
            stopValue: string,
            parent?: DataAccumulator[number]
        ) => {
            const inner = (
                row: number,
                acc: DataAccumulator
            ): { expenses: typeof acc, nextRow: number } => {
                const cell = workSheet.cell(row, 2);
                const cellValue = cell.value?.toString().trim() || '';

                if (!cellValue || cellValue === stopValue) {
                    return { expenses: acc, nextRow: row };
                }

                const { data: bodyData, supplierList: suppliers } = this.buildCreditCardBodyData({
                    row,
                    bill,
                    column: 2,
                    isParent: !parent,
                    groupName,
                    workSheet,
                    supplierList
                });

                if (suppliers?.length) {
                    supplierList.push(...suppliers);
                }

                const accNext = bodyData
                    ? [...acc, { ...bodyData, ...(parent ? { parent } : {}) }]
                    : acc;
                return inner(row + 1, accNext);
            };
            return inner(currentRow, []);
        };

        const processParentWithChildren = (
            data: DataAccumulator,
            initialRow: number,
            supplierList: Array<string>,
            bill: Bill
        ): number => {
            const recurse = (row: number): number => {
                const cell = workSheet.cell(row, 2);
                const value = cell.value?.toString().trim() || '';
                if (cell.isMerged && cell['_mergeCount'] > 2) {

                    const parentName = `${groupName} ${value}`;
                    const parent = data.find((item) => item.name === parentName);
                    if (parent) {
                        const { expenses: children, nextRow } = readExpensesBlock(
                            bill,
                            supplierList,
                            row + 2,
                            '',
                            parent
                        );
                        if (children.length) parent.children = children;
                        return recurse(nextRow + 1);
                    }
                }
                return row;
            };
            return recurse(initialRow);
        };

        const processBills = (
            row: number,
            acc: DataAccumulator
        ): { allBills: typeof acc, nextRow: number } => {
            const cell = workSheet.cell(row, 2);
            const cellValue = cell.value?.toString().trim() || '';
            const match = cellValue.match(regex);

            if (!match) {
                return { allBills: acc, nextRow: row };
            }


            const billType = match[1] as Bill['type'];

            const bankName = match?.[2] || 'Bank';

            const billName = `${groupName} ${snakeCaseToNormal(billType)} ${bankName}`;

            const bill = bills.find((item) => item.name === billName);

            if (!bill) {
                return processBills(row + 1, acc);
            }


            const supplierList: Array<string> = [];
            const { expenses: data, nextRow } = readExpensesBlock(
                bill,
                supplierList,
                row + 2,
                'TOTAL'
            );
            const afterParentRow = processParentWithChildren(data, nextRow + 2, supplierList, bill);
            return processBills(
                afterParentRow,
                [...acc, { ...bill, expenses: data }]
            );
        };
        const { allBills, nextRow } = processBills(startRow, []);

        const data: DataAccumulator = [];
        allBills.forEach((bill) => {
            if (bill['expenses']) {
                const items = bill['expenses'];
                if (Array.isArray(items)) {
                    data.push(...items);
                }
            }
        });

        return {
            data,
            nextRow: nextRow
        };
    }

    public parseToDetailsTable({
                                   bills,
                                   startRow,
                                   groupName,
                                   workSheet
                               }: ParseToDetailsTableParams): ParseToDetailsTable {
        const secondaryBillList = bills.filter((bill) => bill.type !== EBillType.CREDIT_CARD);
        const creditCardBillList = bills.filter((bill) => bill.type === EBillType.CREDIT_CARD);
        const expensesData: ParseToDetailsTable = [];

        const { data: secondaryTableList, nextRow: secondaryTableListNextRow } = this.generateDetailsTable({
            bills: secondaryBillList,
            startRow,
            workSheet
        });

        if (secondaryTableListNextRow !== startRow) {
            expensesData.push(...secondaryTableList);
        }

        const { data: creditCardTableList, nextRow: creditCardTableListNextRow } = this.generateCreditCardTable({
            bills: creditCardBillList,
            groupName,
            startRow: secondaryTableListNextRow,
            workSheet
        });

        if (creditCardTableListNextRow !== secondaryTableListNextRow) {
            expensesData.push(...creditCardTableList);
        }

        return expensesData;

    }

    public buildForCreation(workSheet: WorkSheet, uploadExpenseParams: UploadExpenseParams): Array<CreateExpenseParams> {
        const { totalRows, nextRow } = this.validateWorkSheetToBuild(workSheet);
        const listCreateExpenseParams: Array<CreateExpenseParams> = [];
        for (let i = 0; i < totalRows; i++) {
            const cellDate = workSheet.cell(nextRow + i, 1)?.value?.toString()?.trim() || '';
            const supplier = workSheet.cell(nextRow + i, 2)?.value?.toString()?.trim() || '';
            const cellAmount = workSheet.cell(nextRow + i, 3)?.value?.toString()?.trim() || '';

            const rulesRepeatedWords = !uploadExpenseParams?.repeatedWords ? DEFAULT_REPEAT_WORDS : uploadExpenseParams.repeatedWords;

            const isRepeatWord = supplier !== '' && matchesRepeatWords(supplier, rulesRepeatedWords);

            if (!isRepeatWord) {
                const result = this.buildFromCreditCardSheet(cellDate, cellAmount, supplier, uploadExpenseParams?.replaceWords);

                const createExpenseDto: CreateExpenseParams = {
                    type: 'VARIABLE' as CreateExpenseParams['type'],
                    paid: uploadExpenseParams?.paid,
                    value: result.value,
                    month: uploadExpenseParams?.month,
                    supplier,
                    description: 'Create by Document Import',
                    instalment_number: result.instalment_number,
                }

                listCreateExpenseParams.push(createExpenseDto);
            }
        }

        return this.mapperBuildForCreation(listCreateExpenseParams.filter((item) => item.value && item.value > 0));
    }

    private validateWorkSheetToBuild(workSheet: WorkSheet): ValidateWorkSheetToBuild {
        const { totalRows, nextRow } = workSheet.getCell(1, 1);

        if (totalRows <= 0) {
            throw new Error({
                message: 'The Excel file does not have any rows for Date column.',
                statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION,
            });
        }

        const { totalRows: cellSupplierRows } = workSheet.getCell(1, 2);

        if (totalRows !== cellSupplierRows) {
            throw new Error({
                message: 'The Excel file does not have the same number of rows for Date and Supplier columns.',
                statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION,
            });
        }

        const { totalRows: cellAmountRows } = workSheet.getCell(1, 3);

        if (totalRows !== cellAmountRows) {
            throw new Error({
                message: 'The Excel file does not have the same number of rows for Date and Amount columns.',
                statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION,
            });
        }

        return {
            nextRow,
            totalRows,
        };
    }

    private buildFromCreditCardSheet(cellDate: string, cellAmount: string, cellSupplier: string, replaceWordsParams?: ReplaceWordsParam): BuildFromCreditCardSheet {
        const date = new Date(cellDate);
        const year = date.getFullYear();
        const month = getMonthByIndex(date.getMonth());

        const amount = Number(cellAmount);
        const value = !isNaN(amount) ? Number(amount.toFixed(2)) : 0;

        const { supplier, instalment_number } = this.treatSupplierInstallmentNumber(cellSupplier, replaceWordsParams);

        return {
            year,
            value,
            month: month?.toUpperCase() as EMonth,
            supplier,
            instalment_number,
        }
    }

    private treatSupplierInstallmentNumber(supplier: string, replaceWordsParams?: ReplaceWordsParam) {
        const match = supplier.match(/Parcela\s*(\d+)\s*\/\s*(\d+)/i);
        const instalment_number = match
            ? (() => {
                const current = Number(match[1]);
                const total = Number(match[2]);
                return (!isNaN(current) && !isNaN(total) && total >= current)
                    ? (total - current) + 1
                    : 1;
            })()
            : 1;

        return {
            supplier: this.mapperText(supplier, replaceWordsParams),
            instalment_number,
        };
    }

    private mapperText(text: string, replaceWordsParams?: ReplaceWordsParam): string {
        const rulesReplaceWords = !replaceWordsParams ? DEFAULT_REPLACE_WORDS : replaceWordsParams;

        const result = text
            .replace(/\s*-\s*/g, ' ')
            .replace(/Parcela/gi, '')
            .replace(/\b\d+\/\d+\b/g, '')
            .replace(/\b\d+\b$/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim();

        return replaceWords(result, rulesReplaceWords);
    }

    private mapperBuildForCreation(createExpenseParams: Array<CreateExpenseParams>): Array<CreateExpenseParams> {
        return Object.values(
            createExpenseParams.reduce((acc, createExpenseDto) => {
                const supplierName = typeof createExpenseDto.supplier === 'string'
                    ? createExpenseDto.supplier
                    : createExpenseDto.supplier?.name;

                if (!supplierName) {
                    return acc;
                }

                if (!acc[supplierName]) {
                    acc[supplierName] = <CreateExpenseParams>{ ...createExpenseDto };
                    return acc;
                }
                const value = (acc[supplierName].value || 0) + (createExpenseDto.value || 0);
                acc[supplierName].value = Number(value.toFixed(2));
                return acc;
            }, {} as Record<string, CreateExpenseParams>)
        );
    }
}