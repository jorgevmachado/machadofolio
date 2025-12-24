
import {
  cleanTextByListText ,
  type CycleOfMonths ,
  ECellType ,type EMonth ,Error ,ERROR_STATUS_CODE ,
  getCurrentMonthNumber ,getMonthByIndex ,matchesRepeatWords ,
  MONTHS ,
  snakeCaseToNormal ,
  type TableParams ,
  totalByMonth ,type WorkSheet ,
} from '@repo/services';

import { EBillType } from '../../../../api';
import type { Expense } from '../../../expense';

import {
  type BillExpenseToCreation,
  type BillExpenseToCreationParams ,
  type BodyData ,
  type BuildBodyDataParams ,type BuildForCreationParams ,
  type GetWorkSheetTitle ,
  type GetWorkSheetTitleParams ,
  type ProcessingSpreadsheetDetailTableParams ,
  type ProcessingSpreadsheetSecondaryTablesParams ,
  type ProcessingSpreadsheetTableParams ,
  type SpreadsheetProcessingParams } from './types';

export default class BillSpreadsheetBusiness {
    public spreadsheetProcessing({
                                     summary = true,
                                     startRow = 14,
                                     tableWidth = 3,
                                     groupsName = [],
                                     tableHeader = ['title', ...MONTHS, 'paid', 'total'],
                                     startColumn = 2,
                                     summaryTitle = 'Summary',
                                     detailTables = [],
                                     detailTablesHeader = ['month', 'value', 'paid'],
                                     summaryTableHeader = ['title', 'bank', ...MONTHS, 'paid', 'total'],
                                     ...params
                                 }: SpreadsheetProcessingParams): number {
        const { data, sheet, groupName, allExpensesHaveBeenPaid, buildExpensesTablesParams } = params;
        sheet.createWorkSheet(groupName);

        sheet.workSheet.addCell({
            cell: 'B2',
            type: ECellType.TITLE,
            value: `${groupName}(${params.year})`,
            merge: { cellStart: 'B2', cellEnd: 'Q11' }
        });

        const initialRow = summary
            ? this.processingSpreadsheetTable({
                sheet,
                startRow,
                startColumn,
                table: {
                    data: data.map((item) => ({
                        type: snakeCaseToNormal(item.type),
                        bank: item.bank.name,
                        list: item.expenses ?? []
                    })),
                    title: summaryTitle,
                    footer: true,
                    header: summaryTableHeader,
                },
                buildBodyDataMap: (data) => ({
                    data: !data.item ? data.list : data.item,
                    bank: data.bank,
                    type: data.type,
                    arrFunction: allExpensesHaveBeenPaid
                }),
                buildFooterData: (data) => {
                    const monthsObj = MONTHS.reduce((acc, month) => {
                        acc[month] = totalByMonth(month, data);
                        return acc;
                    }, {} as CycleOfMonths);
                    return {
                        paid: data.every(item => item && item.paid),
                        footer: true,
                        type: 'TOTAL',
                        ...monthsObj,
                        total: data.reduce((sum, item) => sum + (Number(item.total) || 0), 0),
                    };
                }
            })
            : startRow;

        return this.processingSpreadsheetSecondaryTables({
            data,
            sheet,
            startRow: initialRow,
            tableWidth,
            groupsName,
            tableHeader,
            startColumn,
            detailTables,
            detailTablesHeader,
            allExpensesHaveBeenPaid,
            buildExpensesTablesParams
        });
    }

    public getWorkSheetTitle({
                                 row,
                                 merge = 10,
                                 column,
                                 topSpace = 1,
                                 workSheet,
                                 bottomSpace = 2,
                             }: GetWorkSheetTitleParams): GetWorkSheetTitle {
        const cell = workSheet.cell(row, column);
        const text = cell.value ? cell.value.toString().trim() : '';
        const match = text.match(/^(.+?)\s*\((\d{4})\)$/);
        const currentYear = new Date().getFullYear();

        const title = {
            year: !match ? currentYear : Number(match[2]),
            name: !match ? text : match[1]?.trim() || text,
        };

        return {
            year: title.year,
            nextRow: merge + topSpace + bottomSpace + 1,
            groupName: title.name,
        };
    }
    public buildForCreation({ fields, finance, workSheet, uploadBillParams }: BuildForCreationParams): Array<BillExpenseToCreation> {
      if(fields.length === 0) {
        throw new Error({
          message: 'The fields is required in the spreadsheet.',
          statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION
        });
      }

      for(const field of fields) {
        const row = field?.row ?? 1;
        const fieldCell = workSheet.getCell(row, field.column)?.value;
        this.validateFieldToCreation(field.label, fieldCell);
      }

      const { totalRows, nextRow } = this.validateWorkSheetToCreation(workSheet);

      const billExpenseToCreateParams: Array<BillExpenseToCreationParams> = [];
      for (let i = 0; i < totalRows; i++) {
        const cellDate = workSheet.cell(nextRow + i ,1)?.
        value?.
        toString()?.
        trim() || '';
        const dateFromCell = new Date(cellDate);
        const date = isNaN(dateFromCell.getDate()) ? new Date() : dateFromCell;
        const month = getMonthByIndex(date.getMonth());
        const year = date.getFullYear();

        const cellTitle = workSheet.cell(nextRow + i ,2)?.
        value?.
        toString()?.
        trim() || 'END';

        const cellAmount = workSheet.cell(nextRow + i ,3)?.
        value?.
        toString()?.
        trim() || 'END';

        const cellGroup = workSheet.cell(nextRow + i ,4)?.
        value?.
        toString()?.
        trim() || 'END';

        const cellType = workSheet.cell(nextRow + i ,5)?.
        value?.
        toString()?.
        trim() || 'END';

        const cellPaid = workSheet.cell(nextRow + i ,6)?.
        value?.
        toString()?.
        trim() || 'END';
        const paid = uploadBillParams?.paid ?? cellPaid === 'SIM';

        const cellBank = workSheet.cell(nextRow + i ,7)?.
        value?.
        toString()?.
        trim() || 'END';

        const rulesRepeatedWords = uploadBillParams?.repeatedWords ?? [];

        const isRepeatWord = cellTitle !== 'END' && matchesRepeatWords(cellTitle, rulesRepeatedWords);

        if(!isRepeatWord) {
          const billExpenseToCreateParam: BillExpenseToCreationParams = {
            year ,
            paid ,
            date ,
            type: cellType ,
            bank: cellBank ,
            month ,
            group: cellGroup ,
            title: cellTitle ,
            amount: cellAmount ,
            finance: finance,
          };
          billExpenseToCreateParams.push(billExpenseToCreateParam);
        }
      }
      return this.buildBillExpenseToCreation(billExpenseToCreateParams);
    }

    private buildBillExpenseToCreation( billExpenseToCreateParams: Array<BillExpenseToCreationParams>): Array<BillExpenseToCreation>{
      const filtered = billExpenseToCreateParams.filter(
        b => b.title !== 'END' && b.group !== 'END' && b.type !== 'END' ,
      );

      const params = new Map<string ,Array<BillExpenseToCreationParams>>();
      filtered.forEach((item) => {
        const key = `${ item.title }__${ item.group }__${ item.type }`;
        if (!params.has(key)) {
          params.set(key ,[]);
        }
        params.get(key)?.push(item);
      });

      return Array.from(params.values()).map(param => {
        const monthMap = new Map<string ,string>();
        param.forEach(item => {
          const month = item.month;
          if (month) {
            monthMap.set(month ,item.amount);
          }
        });
        const groupListItem = param[0];

        const currentDate = new Date();

        const months: BillExpenseToCreation['months'] = MONTHS.map(month => {
          const strValue = monthMap.get(month) ?? '0.00';
          const value = Number(strValue);
          return {
            year: groupListItem?.year ?? currentDate.getFullYear() ,
            paid: groupListItem?.paid ?? false ,
            code: getCurrentMonthNumber(month) ,
            value ,
            label: month ,
            month: month.toUpperCase() as EMonth ,
            received_at: groupListItem?.date ?? currentDate,
          };
        });
        const total = months.reduce((acc ,item) => acc + Number(item.value) ,0);

        return {
          ...groupListItem ,
          paid: groupListItem?.paid ?? false ,
          year: groupListItem?.year ?? currentDate.getFullYear() ,
          type: groupListItem?.type ?? EBillType.BANK_SLIP,
          bank: groupListItem?.bank ?? 'Nubank',
          date: groupListItem?.date ?? currentDate,
          title: groupListItem?.title ?? 'unknow',
          group: groupListItem?.group ?? 'unknow' ,
          amount: total.toFixed(2) ,
          months ,
        };
      });
    }

    private validateFieldToCreation(field: string, value?: string) {
      if(!value || value === '') {
        throw new Error({
          message: `The ${field} field is required in the spreadsheet.`,
          statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION ,
        });
      }

    }

    private validateWorkSheetToCreation(workSheet: WorkSheet): { totalRows: number; nextRow: number } {
      const { totalRows ,nextRow } = workSheet.getCell(1 ,1);

      if (totalRows <= 0) {
        throw new Error({
          message: 'The Excel file does not have any rows for Date column.' ,
          statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION ,
        });
      }

      const { totalRows: cellDateRows } = workSheet.getCell(1 ,2);

      if (totalRows !== cellDateRows) {
        throw new Error({
          message: 'The Excel file does not have the same number of rows for Date columns.' ,
          statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION ,
        });
      }

      const { totalRows: cellTitleRows } = workSheet.getCell(1 ,3);

      if (totalRows !== cellTitleRows) {
        throw new Error({
          message: 'The Excel file does not have the same number of rows for Date and title columns.' ,
          statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION ,
        });
      }

      const { totalRows: cellAmountRows } = workSheet.getCell(1 ,4);

      if (totalRows !== cellAmountRows) {
        throw new Error({
          message: 'The Excel file does not have the same number of rows for Date and amount columns.' ,
          statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION ,
        });
      }

      const { totalRows: cellGroupRows } = workSheet.getCell(1 ,5);

      if (totalRows !== cellGroupRows) {
        throw new Error({
          message: 'The Excel file does not have the same number of rows for Date and groups columns.' ,
          statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION ,
        });
      }

      const { totalRows: cellTypeRows } = workSheet.getCell(1 ,6);

      if (totalRows !== cellTypeRows) {
        throw new Error({
          message: 'The Excel file does not have the same number of rows for Date and type columns.' ,
          statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION ,
        });
      }

      return {
        nextRow ,
        totalRows ,
      };
    }

    private processingSpreadsheetTable(params: ProcessingSpreadsheetTableParams<Expense>): number {
        const { sheet, table, startRow, startColumn, buildBodyDataMap, buildFooterData } = params;

        if (!table) {
            return startRow;
        }

        const { title, data = [], header, footer } = table;

        const tableBodyData = data.map((body) => this.buildBodyData<Expense>(buildBodyDataMap(body)));


        if (!tableBodyData.length) {
            return startRow;
        }

        const tableParams: TableParams = {
            body: { list: tableBodyData },
            title: !title ? undefined : { value: title },
            headers: { list: header },
            startRow: startRow,
            tableWidth: header.length,
            startColumn
        };

        if (footer && buildFooterData) {
            tableParams.footer = buildFooterData(tableBodyData);
        }

        const positions = sheet.addTable(tableParams);


        return positions.nextRow + 1;
    }

    private buildBodyData<T>({ data, arrFunction, ...params }: BuildBodyDataParams<T>): BodyData {
        const isDataArray = Array.isArray(data);
        const monthsObj = MONTHS.reduce((acc, month) => {
            acc[month] = isDataArray ? totalByMonth(month, data as Array<Record<string, unknown>>) : data[month];
            return acc;
        }, {} as CycleOfMonths);

        const bodyData: BodyData = {
            paid: isDataArray ? arrFunction(data) : data['paid'],
            ...params,
            ...monthsObj,
            total: 0
        };

        bodyData['total'] = MONTHS.reduce((sum, month) => sum + (Number(bodyData[month]) || 0), 0);
        return bodyData;
    }

    private processingSpreadsheetSecondaryTables(params: ProcessingSpreadsheetSecondaryTablesParams): number {
        const {
            data,
            sheet,
            startRow,
            tableWidth,
            groupsName,
            tableHeader,
            startColumn,
            detailTables,
            detailTablesHeader,
            allExpensesHaveBeenPaid,
            buildExpensesTablesParams
        } = params;
        return detailTables?.reduce((currentRow, type) => {
            const currentData = data.filter((item) => item.type === type);

            if (type !== 'CREDIT_CARD') {
                return this.processingSpreadsheetDetailTable({
                    sheet,
                    table: {
                        data: currentData.map((data) => ({
                            title: cleanTextByListText(groupsName, data.name),
                            list: data.expenses ?? []
                        })),
                        title: type,
                        header: detailTablesHeader,
                    },
                    startRow: currentRow,
                    tableWidth,
                    detailTablesHeader,
                    buildExpensesTablesParams
                });
            }

            return currentData.reduce((row, data) => {
                const expenses = data.expenses ?? [];
                const parentExpenses = expenses.filter((expense) => !expense.is_aggregate);

                const rowAfterParent = !parentExpenses.length ? row : this.processingSpreadsheetTable({
                    sheet,
                    startRow: row,
                    startColumn,
                    table: {
                        data: parentExpenses.map((parent) => ({
                            title: cleanTextByListText(groupsName, parent.name),
                            list: [],
                            item: parent
                        })),
                        title: `${data.type}(${data.bank.name})`,
                        footer: true,
                        header: tableHeader,
                    },
                    buildBodyDataMap: (data) => ({
                        data: !data.item ? data.list : data.item,
                        bank: data.bank,
                        title: data.title,
                        arrFunction: allExpensesHaveBeenPaid
                    }),
                    buildFooterData: (data) => {
                        const monthsObj = MONTHS.reduce((acc, month) => {
                            acc[month] = totalByMonth(month, data);
                            return acc;
                        }, {} as CycleOfMonths);
                        return {
                            paid: data.every(item => item && item.paid),
                            footer: true,
                            title: 'TOTAL',
                            ...monthsObj,
                            total: data.reduce((sum, item) => sum + (Number(item.total) || 0), 0),
                        };
                    }
                });
                return parentExpenses.reduce((parentRow, parent) => {
                    const childrenExpenses = parent.children ?? [];
                    return !childrenExpenses.length ? parentRow : this.processingSpreadsheetTable({
                        sheet,
                        startRow: parentRow,
                        startColumn,
                        table: {
                            data: childrenExpenses.map((child) => ({
                                title: cleanTextByListText(groupsName, child.name),
                                list: [],
                                item: child
                            })),
                            title: cleanTextByListText(groupsName, parent.name),
                            footer: true,
                            header: tableHeader,
                        },
                        buildBodyDataMap: (data) => ({
                            data: !data.item ? data.list : data.item,
                            bank: data.bank,
                            title: data.title,
                            arrFunction: allExpensesHaveBeenPaid
                        }),
                    });
                }, rowAfterParent);
            }, currentRow);
        }, startRow);
    }

    private processingSpreadsheetDetailTable(params: ProcessingSpreadsheetDetailTableParams): number {
        const { sheet, startRow, tableWidth, table, detailTablesHeader, buildExpensesTablesParams } = params;

        if (!table) {
            return startRow;
        }

        const { title, data = [] } = table;

        const expenses = data.flatMap(item => item.list ?? []);

        const expenseTables = buildExpensesTablesParams(expenses, tableWidth, detailTablesHeader);

        if (!expenseTables.tables.length) {
            return startRow;
        }

        const positions = sheet.addTables({
            ...expenseTables,
            blockTitle: !title ? undefined : title,
            firstTableRow: startRow
        });

        return positions.nextRow + 1;
    }
}