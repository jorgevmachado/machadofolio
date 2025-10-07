import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

jest.mock('@repo/services', () => {
    const originalModule = jest.requireActual('@repo/services');
    return {
        ...((typeof originalModule === 'object' && originalModule !== null) ? originalModule : {}),
        Spreadsheet: jest.fn(),
        getCurrentMonth: jest.fn(),
        cleanTextByListText: jest.fn(),
    };
});

jest.mock('../../expense', () => {
    class ExpenseMock {}
    return { Expense: ExpenseMock };
});

jest.mock('../../../bill', () => {
    class BillMock {}
    return { Bill: BillMock, EBillType: {
            PIX: 'PIX',
            BANK_SLIP: 'BANK_SLIP',
            CREDIT_CARD: 'CREDIT_CARD',
            ACCOUNT_DEBIT: 'ACCOUNT_DEBIT',
        }};
});

import * as services from '@repo/services';
import { CycleOfMonths, MONTHS, Spreadsheet } from '@repo/services';

import type { BillEntity } from '../../../bill';

import { BILL_MOCK, EXPENSE_MOCK } from '../../../mock';

import { ExpenseEntity } from '../../types';

import  SpreadsheetBusiness from './spreadsheet';

describe('Expense Spreadsheet Business', () => {
    let business: SpreadsheetBusiness;
    let spreadsheetMock: jest.Mocked<Spreadsheet>;

    const mockEntity: ExpenseEntity = EXPENSE_MOCK as unknown as ExpenseEntity;
    const mockBillEntity: BillEntity = BILL_MOCK as unknown as BillEntity;

    beforeEach(() => {
        spreadsheetMock = {
            addTable: jest.fn().mockImplementation(() => {
                return { nextRow: 1 };
            }),
            addTables: jest.fn().mockImplementation(() => {
                return { nextRow: 1 };
            }),
            workSheet: {
                cell: jest.fn(),
                addCell: jest.fn(),
            },
            createWorkSheet: jest.fn(),
            calculateTableHeight: jest.fn(({ total }) => total || 0),
            calculateTablesParamsNextRow: jest.fn(({ startRow = 0, totalTables = 0, linesPerTable = 0 }) => (
                startRow + (totalTables * (linesPerTable + 1))
            )),
        } as unknown as jest.Mocked<Spreadsheet>;
        jest.spyOn(services, 'Spreadsheet').mockReturnValue(spreadsheetMock);
        jest.clearAllMocks();
        jest.restoreAllMocks();
        jest.resetModules();
        business = new SpreadsheetBusiness();
    });

    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    describe('buildTablesParams', () => {
        const tableWidth = 3;
        it('Should build table parameters correctly.', () => {
            const result = business.buildTablesParams([mockEntity], tableWidth);
            expect(result).toHaveProperty('tables');
            expect(Array.isArray(result.tables)).toBe(true);
            expect(result.tableWidth).toBe(tableWidth);
            expect(result.tables[0].title).toBeDefined();
            expect(Array.isArray(result.tables[0].data)).toBe(true);
        });

        it('Should build the table parameters correctly with the default title.', () => {
            const result = business.buildTablesParams([{ ...mockEntity, supplier: undefined }], tableWidth);
            expect(result.tables[0].title).toEqual('expense');
        });
    });

    describe('parseToDetailsTable', () => {
        const secondaryBill = { ...mockBillEntity, type: 'PIX' as BillEntity['type'] };
        const creditCardBill = { ...mockBillEntity, type: 'CREDIT_CARD' as BillEntity['type'] };

        it('should return empty array if there is no bills.', () => {
            jest.spyOn(business, 'generateDetailsTable' as any).mockReturnValue({ data: [], nextRow: 10 });
            jest.spyOn(business, 'generateCreditCardTable' as any).mockReturnValue({ data: [], nextRow: 10 });

            const result = business.parseToDetailsTable({
                bills: [],
                startRow: 2,
                groupName: 'ANY',
                workSheet: spreadsheetMock.workSheet,
            });
            expect(result).toEqual([]);
        });

        it('should return a list of expenses.', () => {
            const bills = [secondaryBill, creditCardBill];

            const generateDetailsTable = jest
                .spyOn(business, 'generateDetailsTable' as any)
                .mockReturnValue({ data: [{ e: 1 }], nextRow: 5 });

            const generateCreditCardTable = jest
                .spyOn(business, 'generateCreditCardTable' as any)
                .mockReturnValue({ data: [{ cc: 99 }], nextRow: 6 });

            const result = business.parseToDetailsTable({
                bills,
                startRow: 2,
                groupName: 'GRUPO-X',
                workSheet: spreadsheetMock.workSheet,
            });

            expect(generateDetailsTable).toHaveBeenCalledWith({
                bills: [secondaryBill],
                startRow: 2,
                workSheet: spreadsheetMock.workSheet,
            });

            expect(generateCreditCardTable).toHaveBeenCalledWith({
                bills: [creditCardBill],
                groupName: 'GRUPO-X',
                startRow: 5,
                workSheet: spreadsheetMock.workSheet,
            });

            expect(result).toEqual([{ e: 1 }, { cc: 99 }]);
        });

        it('do not add secondary if nextRow does not change.', () => {

            jest
                .spyOn(business, 'generateDetailsTable' as any)
                .mockReturnValue({ data: [{ e: 'x' }], nextRow: 2 });

            jest
                .spyOn(business, 'generateCreditCardTable' as any)
                .mockReturnValue({ data: [{ cc: 24 }], nextRow: 5 });

            const result = business.parseToDetailsTable({
                bills: [secondaryBill, creditCardBill],
                startRow: 2,
                groupName: 'g',
                workSheet: spreadsheetMock.workSheet,
            });

            expect(result).toEqual([{ cc: 24 }]);
        });

        it('do not add credit card if nextRow does not change.', () => {

            jest
                .spyOn(business, 'generateDetailsTable' as any)
                .mockReturnValue({ data: [{ e: 'x' }], nextRow: 10 });

            jest
                .spyOn(business, 'generateCreditCardTable' as any)
                .mockReturnValue({ data: [{ cc: 77 }], nextRow: 10 });

            const result = business.parseToDetailsTable({
                bills: [secondaryBill, creditCardBill],
                startRow: 2,
                groupName: 'abc',
                workSheet: spreadsheetMock.workSheet,
            });

            expect(result).toEqual([{ e: 'x' }]);
        });

        it('only returns credit card if there is no secondary.', () => {

            jest
                .spyOn(business, 'generateDetailsTable' as any)
                .mockReturnValue({ data: [], nextRow: 5 });

            jest
                .spyOn(business, 'generateCreditCardTable' as any)
                .mockReturnValue({ data: [{ cc: 1 }], nextRow: 7 });

            const result = business.parseToDetailsTable({
                bills: [creditCardBill],
                startRow: 3,
                groupName: 'q',
                workSheet: spreadsheetMock.workSheet,
            });

            expect(result).toEqual([{ cc: 1 }]);
        });

        it('returns only secondary if there is no credit card.', () => {

            jest
                .spyOn(business, 'generateDetailsTable' as any)
                .mockReturnValue({ data: [{ s: 123 }], nextRow: 5 });

            jest
                .spyOn(business, 'generateCreditCardTable' as any)
                .mockReturnValue({ data: [], nextRow: 5 });

            const result = business.parseToDetailsTable({
                bills: [secondaryBill],
                startRow: 4,
                groupName: 'g',
                workSheet: spreadsheetMock.workSheet,
            });

            expect(result).toEqual([{ s: 123 }]);
        });

        it('returns empty if both are not added.', () => {
            jest
                .spyOn(business, 'generateDetailsTable' as any)
                .mockReturnValue({ data: [], nextRow: 4 });

            jest
                .spyOn(business, 'generateCreditCardTable' as any)
                .mockReturnValue({ data: [], nextRow: 4 });

            const result = business.parseToDetailsTable({
                bills: [secondaryBill, creditCardBill],
                startRow: 4,
                groupName: 'g',
                workSheet: spreadsheetMock.workSheet,
            });

            expect(result).toEqual([]);
        });
    });

    describe('private', () => {
        describe('buildDetailData', () => {
            it('should return undefined if the title value is empty.', () => {
                const result = business['buildDetailData']({
                    row: 5,
                    bill: mockBillEntity,
                    cell: { value: undefined } as any,
                    column: 2,
                    workSheet: spreadsheetMock.workSheet
                });
                expect(result).toBeUndefined();
            });

            it('should return undefined if cell.value is empty string.', () => {
                const result = business['buildDetailData']({
                    row: 5,
                    bill: mockBillEntity,
                    cell: { value: '     ' } as any,
                    column: 2,
                    workSheet: spreadsheetMock.workSheet
                });
                expect(result).toBeUndefined();
            });

            it('should return the correctly populated BuildDetailData object.', () => {
                const rowsBase = 9;
                const mockValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
                const mockPaid = ['YES', 'NO', 'YES', 'NO', 'YES', 'NO', 'YES', 'YES', 'NO', 'NO', 'YES', 'NO'];

                spreadsheetMock.workSheet.cell.mockImplementation((row, column) => {
                    const index = Number(row) - rowsBase;
                    if (column === 5 && index >= 0 && index < 12) {
                        return { value: mockValues[index] } as any;
                    }
                    if (column === 6 && index >= 0 && index < 12) {
                        return { value: mockPaid[index] } as any;
                    }
                    return { value: undefined } as any;
                });

                const result = business['buildDetailData']({
                    row: rowsBase,
                    cell: { value: ' SupplierX ' } as any,
                    bill: mockBillEntity,
                    column: 5,
                    workSheet: spreadsheetMock.workSheet,
                });

                expect(result).toBeDefined();
                expect(result?.supplier).toBe('SupplierX');
                expect(result?.bill).toBe(mockBillEntity);
                MONTHS.forEach((m, i) => {
                    expect(result?.[m]).toBe(mockValues[i]);
                    expect(result?.[`${m}_paid`]).toBe(mockPaid[i] === 'YES');
                });
            });

            it('must use value 0 and paid NO when cells return empty/undefined.', () => {
                spreadsheetMock.workSheet.cell.mockImplementation(() => ({ value: undefined }) as any);
                const result = business['buildDetailData']({
                    row: 100,
                    cell: { value: 'SupplierEmpty' } as any,
                    bill: mockBillEntity,
                    column: 10,
                    workSheet: spreadsheetMock.workSheet,
                });
                expect(result).toBeDefined();
                expect(result?.supplier).toBe('SupplierEmpty');
                expect(result?.bill).toBe(mockBillEntity);

                for (const month of MONTHS) {
                    expect(result?.[month]).toBe(0);
                    expect(result?.[`${month}_paid`]).toBe(false);
                }
            });

            it('must trim the title correctly.', () => {
                spreadsheetMock.workSheet.cell.mockImplementation((row, column) => {
                    if (Number(column) % 2 === 0) {
                        return { value: 7 } as any;
                    }
                    return { value: 'YES' } as any;
                });

                const result = business['buildDetailData']({
                    row: 0,
                    cell: { value: '   MySupplier   ' } as any,
                    bill: mockBillEntity,
                    column: 2,
                    workSheet: spreadsheetMock.workSheet,
                });
                expect(result).toBeDefined();
                expect(result?.supplier).toBe('MySupplier');
            });
        });

        describe('buildGroupTable', () => {
            it('should return correct object when cell is merged (_mergeCount === 2).', () => {

                const buildDetailDataMock = jest.spyOn(business, 'buildDetailData' as any)
                    .mockImplementation(({ column }: any) => ({ column, key: `mock${column}` }));

                spreadsheetMock.workSheet.cell
                    .mockReturnValueOnce({ isMerged: true, _mergeCount: 2 } as any)
                    .mockReturnValueOnce({} as any)
                    .mockReturnValueOnce({} as any);

                const result = business['buildGroupTable']({
                    row: 10,
                    bill: mockBillEntity,
                    workSheet: spreadsheetMock.workSheet,
                });

                expect(spreadsheetMock.workSheet.cell).toHaveBeenNthCalledWith(1, 10, 3);
                expect(spreadsheetMock.workSheet.cell).toHaveBeenNthCalledWith(2, 10, 8);
                expect(spreadsheetMock.workSheet.cell).toHaveBeenNthCalledWith(3, 10, 13);

                expect(buildDetailDataMock).toHaveBeenCalledTimes(3);
                expect(result.data).toHaveLength(3);
                expect(result.data[0]).toEqual(expect.objectContaining({ column: 4 }));
                expect(result.data[1]).toEqual(expect.objectContaining({ column: 9 }));
                expect(result.data[2]).toEqual(expect.objectContaining({ column: 14 }));
                expect(result.nextRow).toBe(25);
                expect(result.hasNext).toBe(true);
            });

            it('should skip null/undefined data from buildDetailData.', () => {
                jest.spyOn(business, 'buildDetailData' as any)
                    .mockReturnValueOnce(null)
                    .mockReturnValueOnce(undefined)
                    .mockReturnValueOnce({ chave: 'ok', column: 14 });

                spreadsheetMock.workSheet.cell
                    .mockReturnValueOnce({ isMerged: true, _mergeCount: 2 } as any)
                    .mockReturnValueOnce({} as any)
                    .mockReturnValueOnce({} as any);

                const result = business['buildGroupTable']({
                    row: 15,
                    bill: mockBillEntity,
                    workSheet: spreadsheetMock.workSheet,
                });

                expect(result.data).toHaveLength(1);
                expect(result.data[0]).toEqual(expect.objectContaining({ column: 14 }));
                expect(result.hasNext).toBe(true);
            });

            it('should return empty data, nextRow equal to row and hasNext false if cell is not merged or mergeCount !== 2.', () => {
                spreadsheetMock.workSheet.cell.mockReturnValue({ isMerged: false, _mergeCount: 2 } as any);

                let result = business['buildGroupTable']({
                    row: 2,
                    bill: mockBillEntity,
                    workSheet: spreadsheetMock.workSheet,
                });
                expect(result).toEqual({ data: [], nextRow: 2, hasNext: false });

                spreadsheetMock.workSheet.cell.mockReturnValue({ isMerged: true, _mergeCount: 3 } as any);

                result = business['buildGroupTable']({
                    row: 5,
                    bill: mockBillEntity,
                    workSheet: spreadsheetMock.workSheet,
                });
                expect(result).toEqual({ data: [], nextRow: 5, hasNext: false });
            });
        });

        describe('accumulateGroupTables', () => {
            it('should accumulate data when hasNext is false (no recursion).', () => {
                const acc = [{ name: 'item1' }];
                const startRow = 5;

                const buildGroupTableMock = jest.spyOn(business as any, 'buildGroupTable').mockImplementation(() => ({
                    data: [{ name: 'item2' }, { name: 'item3' }],
                    nextRow: 10,
                    hasNext: false
                }));

                const result = business['accumulateGroupTables']({
                    acc,
                    bill: mockBillEntity,
                    startRow,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(buildGroupTableMock).toHaveBeenCalledWith({
                    row: startRow,
                    bill: mockBillEntity,
                    workSheet: spreadsheetMock.workSheet
                });
                expect(result.acc).toEqual([
                    { name: 'item1' },
                    { name: 'item2' },
                    { name: 'item3' }
                ]);
                expect(result.lastRow).toBe(10);
                expect(buildGroupTableMock).toHaveBeenCalledTimes(1);
            });

            it('must accumulate data across multiple recursions when hasNext is true.', () => {
                const acc = [];
                const startRow = 1;

                const buildGroupTableMock = jest
                    .spyOn(business as any, 'buildGroupTable')
                    .mockImplementationOnce((params) => ({
                        data: [{ sequence: 1 }],
                        nextRow: 2,
                        hasNext: true
                    }))
                    .mockImplementationOnce((params) => ({
                        data: [{ sequence: 2 }],
                        nextRow: 3,
                        hasNext: true
                    }))
                    .mockImplementationOnce((params) => ({
                        data: [{ sequence: 3 }],
                        nextRow: 4,
                        hasNext: false
                    }));

                const result = business['accumulateGroupTables']({
                    acc,
                    bill: mockBillEntity,
                    startRow,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(buildGroupTableMock).toHaveBeenCalledTimes(3);
                expect(result.acc).toEqual([
                    { sequence: 1 },
                    { sequence: 2 },
                    { sequence: 3 }
                ]);
                expect(result.lastRow).toBe(4);
            });

            it('should return the accumulated amounts correctly even if the data is empty.', () => {
                const acc: any[] = [];
                const startRow = 2;

                const buildGroupTableMock = jest.spyOn(business as any, 'buildGroupTable').mockImplementation(() => ({
                    data: [],
                    nextRow: 7,
                    hasNext: false
                }));

                const result = business['accumulateGroupTables']({
                    acc,
                    bill: mockBillEntity,
                    startRow,
                    workSheet: spreadsheetMock.workSheet,
                });

                expect(result.acc).toEqual([]);
                expect(result.lastRow).toBe(7);
                expect(buildGroupTableMock).toHaveBeenCalledTimes(1);
            });

            it('must correctly pass accumulated data between recursions.', () => {
                const acc = [{ existing: true }];
                const startRow = 5;

                const buildGroupTableMock = jest
                    .spyOn(business as any, 'buildGroupTable')
                    .mockImplementationOnce(() => ({
                        data: [{ d: 1 }],
                        nextRow: 6,
                        hasNext: true
                    }))
                    .mockImplementationOnce(() => ({
                        data: [{ d: 2 }],
                        nextRow: 7,
                        hasNext: false
                    }));

                const result = business['accumulateGroupTables']({
                    acc,
                    bill: mockBillEntity,
                    startRow,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(result.acc).toEqual([
                    { existing: true },
                    { d: 1 },
                    { d: 2 }
                ]);
                expect(result.lastRow).toBe(7);
                expect(buildGroupTableMock).toHaveBeenCalledTimes(2);
                expect(buildGroupTableMock).toHaveBeenNthCalledWith(1, {
                    row: 5,
                    bill: mockBillEntity,
                    workSheet: spreadsheetMock.workSheet
                });
                expect(buildGroupTableMock).toHaveBeenNthCalledWith(2, {
                    row: 6,
                    bill: mockBillEntity,
                    workSheet: spreadsheetMock.workSheet
                });
            });
        });

        describe('generateDetailsTable', () => {
            it('should return acc and nextRow when cell value is empty.', () => {
                spreadsheetMock.workSheet.cell.mockReturnValueOnce(undefined as any);
                const result = business['generateDetailsTable']({
                    bills: [mockBillEntity],
                    startRow: 10,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(result.data).toEqual([]);
                expect(result.nextRow).toBe(10);
            });

            it('should return acc and nextRow when type does not exist in bills.', () => {
                spreadsheetMock.workSheet.cell.mockReturnValueOnce({ value: 'UNKNOWN_TYPE' } as any);

                const result = business['generateDetailsTable']({
                    bills: [mockBillEntity],
                    startRow: 5,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(result.data).toEqual([]);
                expect(result.nextRow).toBe(5);
            });

            it('should recurse and accumulate correctly when the type exists and accumulateGroupTables is called.', () => {
                const billTypeBankSlipMock = { ...mockBillEntity, type: 'BANK_SLIP' as BillEntity['type'] };
                let call = 0;

                spreadsheetMock.workSheet.cell.mockImplementation((row, col) => {
                    call++;
                    if (call === 1) {
                        return { value: 'BANK_SLIP' } as any;
                    }
                    return { value: '' } as any;
                });

                const accReturn = ['some accumulated'] as any;

                const spy = jest
                    .spyOn(business as any, 'accumulateGroupTables')
                    .mockReturnValue({ acc: accReturn, lastRow: 20 });


                const result = business['generateDetailsTable']({
                    bills: [billTypeBankSlipMock],
                    startRow: 7,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(spy).toHaveBeenCalledWith({
                    acc: [],
                    bill: billTypeBankSlipMock,
                    startRow: 8,
                    workSheet: spreadsheetMock.workSheet
                });
                expect(spreadsheetMock.workSheet.cell).toHaveBeenCalledTimes(2);
                expect(result.data).toBe(accReturn);
                expect(result.nextRow).toBe(20);
            });

            it('must handle multiple recursive calls if applicable.', () => {
                const billTypeBankSlipMock = { ...mockBillEntity, type: 'BANK_SLIP' as BillEntity['type'] };
                const billTypeAccountDebitMock = { ...mockBillEntity, type: 'ACCOUNT_DEBIT' as BillEntity['type'] };

                const types = [
                    'BANK_SLIP' as BillEntity['type'],
                    'ACCOUNT_DEBIT' as BillEntity['type'],
                    'BANK_SLIP' as BillEntity['type'],
                    ''
                ];

                let idx = 0;
                spreadsheetMock.workSheet.cell.mockImplementation((row, col) => ({
                    value: types[idx++]
                }) as any);


                const bills = [billTypeBankSlipMock, billTypeAccountDebitMock];

                const accumulateSpy = jest.spyOn(business as any, 'accumulateGroupTables')
                    .mockImplementation(({ acc }: any) => {
                        if (acc.length === 0) {
                            return { acc: ['A'], lastRow: 11 };
                        }
                        if (acc.length === 1) {
                            return { acc: ['A', 'B'], lastRow: 21 };
                        }
                        return { acc: ['A', 'B', 'C'], lastRow: 31 };
                    });

                const result = business['generateDetailsTable']({
                    bills,
                    startRow: 1,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(accumulateSpy).toHaveBeenCalledTimes(3);
                expect(spreadsheetMock.workSheet.cell).toHaveBeenCalledTimes(4);
                expect(result.data).toEqual(['A', 'B', 'C']);
                expect(result.nextRow).toBe(31);
            });
        });

        describe('buildCreditCardBodyData', () => {
            function buildMockWorksheet(cells: Array<any>) {
                let call = 0;
                spreadsheetMock.workSheet.cell.mockImplementation((row, col) => {
                    call++;
                    return { value: cells[call - 1] } as any;
                });
            }

            it('should correctly generate the object for the default case (isParent = true).', () => {
                jest.spyOn(services, 'cleanTextByListText').mockImplementationOnce(() => 'Physical');
                const cells = [
                    'Credit Card Nubank Physical',
                    '100',
                    '200',
                    '300',
                    '400',
                    '500',
                    '600',
                    '700',
                    '800',
                    '900',
                    '1000',
                    '1100',
                    '1200',
                    'YES',
                    '7800'
                ];
                buildMockWorksheet(cells);

                const result = business['buildCreditCardBodyData']({
                    row: 1,
                    bill: mockBillEntity,
                    column: 1,
                    isParent: true,
                    groupName: 'Personal',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList: [],
                });

                expect(result.data.name).toBe('Personal Credit Card Nubank Physical');

                MONTHS.forEach((month, i) => {
                    expect(result.data[month]).toBe(Number(cells[i + 1]));
                    expect(result.data[`${month}_paid`]).toBe(true);
                });

                expect(result.data.year).toBe(mockBillEntity.year);
                expect(result.data.bill).toBe(mockBillEntity);
                expect(result.data.supplier).toBe('Physical');
                expect(result.data.is_aggregate).toBe(false);
                expect(result.data.paid).toBe(true);
                expect(result.data.total).toBe(7800);
                expect(result.supplierList).toEqual(['Physical']);
                expect(result.data.aggregate_name).toBe('');
            });

            it('should generate correctly with isParent = false and supplierList populated.', () => {
                jest.spyOn(services, 'cleanTextByListText')
                    .mockImplementationOnce(() => 'Apache')
                    .mockImplementationOnce(() => 'Physical');
                const supplierList = ['Ifood', 'Physical'];
                const cells = [
                    'Credit Card Nubank Physical Apache', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'NO', '66'
                ];

                buildMockWorksheet(cells);

                const result = business['buildCreditCardBodyData']({
                    row: 1,
                    column: 1,
                    bill: mockBillEntity,
                    isParent: false,
                    groupName: 'Personal',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList,
                });

                expect(result.data.name).toBe('Personal Credit Card Nubank Physical Apache');
                MONTHS.forEach((month, i) => {
                    expect(result.data[month]).toBe(Number(cells[i + 1]));
                    expect(result.data[`${month}_paid`]).toBe(false);
                });
                expect(result.data.is_aggregate).toBe(true);
                expect(result.data.paid).toBe(false);
                expect(result.data.supplier).toBe('Apache');
                expect(result.data.aggregate_name).toBe('Physical');
                expect(result.supplierList).toEqual([]);
            });

            it('must handle missing values (empty or non-numeric cells).', () => {
                jest.spyOn(services, 'cleanTextByListText').mockImplementationOnce(() => 'string');
                const cells = [
                    '', 'A', null, undefined, '', '1', '2', '3', '4', '5', null, '', // meses
                    '', '',
                ];

                buildMockWorksheet(cells);

                const result = business['buildCreditCardBodyData']({
                    row: 1,
                    bill: mockBillEntity,
                    column: 1,
                    isParent: true,
                    groupName: 'Personal',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList: undefined,
                });

                MONTHS.forEach((month, i) => {
                    const cell = cells?.[i + 1];
                    const cellNumber = Number(cell);
                    if (Number.isNaN(cellNumber)) {
                        expect(result.data[month]).toBe(0);
                    } else {
                        expect(result.data[month]).toBe(cellNumber);
                    }
                });

                MONTHS.forEach((month) => {
                    expect(result.data[`${month}_paid`]).toBe(false);
                });
                expect(result.data.paid).toBe(false);
                expect(result.data.total).toBe(0);
                expect(typeof result.data.supplier).toBe('string');
                expect(Array.isArray(result.supplierList)).toBe(true);
            });

            it('should work if supplierList is not passed.', () => {
                jest.spyOn(services, 'cleanTextByListText').mockImplementationOnce(() => '');
                const cells = [
                    'SupplierX', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'NO', '12'
                ];
                buildMockWorksheet(cells);

                const result = business['buildCreditCardBodyData']({
                    row: 1,
                    bill: mockBillEntity,
                    column: 1,
                    isParent: false,
                    groupName: 'Personal',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList: undefined,
                });

                expect(result.supplierList).toEqual([]);
                expect(result.data.is_aggregate).toBe(true);
            });

            it('should work with all default values and supplier not found.', () => {
                jest.spyOn(services, 'cleanTextByListText').mockImplementationOnce(() => '');
                const cells = new Array(15).fill(undefined);
                buildMockWorksheet(cells);

                const result = business['buildCreditCardBodyData']({
                    row: 1,
                    bill: { ...mockBillEntity, name: 'OTHER CARD' },
                    column: 1,
                    isParent: true,
                    groupName: 'OTHER CARD',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList: undefined,
                });

                expect(result.data.supplier).toBe('');
                expect(result.data.total).toBe(0);
                expect(result.data.paid).toBe(false);
            });

            it('should return aggregate_name as empty string when cleanTextByListText returns undefined.', () => {

                jest.spyOn(services, 'cleanTextByListText')
                    .mockImplementationOnce(() => 'SupplierX')
                    .mockImplementationOnce(() => undefined);

                const row = 1;
                const column = 1;
                spreadsheetMock.workSheet.cell.mockReturnValue({ value: 'SupplierX' } as any);

                const result = business['buildCreditCardBodyData']({
                    row,
                    bill: mockBillEntity,
                    column,
                    isParent: true,
                    groupName: 'GroupName',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList: []
                });

                expect(result.data.aggregate_name).toBe('');
            });
        });

        describe('generateCreditCardTable', () => {
            const groupName = 'Personal';

            beforeEach(() => {
                jest.clearAllMocks();
                jest.restoreAllMocks();
            });

            afterEach(() => {
                jest.resetModules();
                jest.restoreAllMocks();
            });

            function buildMockWorksheet(rowsProps: Array<any>) {
                spreadsheetMock.workSheet.cell.mockImplementation((row, col) => {
                    const values = rowsProps[row] ?? {};
                    return {
                        value: values.value ?? '',
                        isMerged: values.isMerged ?? false,
                        _mergeCount: values._mergeCount ?? 0
                    } as any;
                });
            }

            function buildCreditCardBodyDataMock(props: Array<any>) {
                const monthsObj = MONTHS.reduce((acc, month) => {
                    acc[month] = 0;
                    acc[`${month}_paid`] = false;
                    return acc;
                }, {} as CycleOfMonths);
                props.forEach((prop, i) => {
                    const { name, supplier, is_aggregate, aggregate_name, supplierList = [] } = prop ?? {};
                    jest.spyOn(business as any, 'buildCreditCardBodyData').mockImplementationOnce(() => ({
                        data: {
                            ...monthsObj,
                            name,
                            year: 2025,
                            paid: false,
                            bill: mockEntity,
                            total: 1000,
                            supplier,
                            is_aggregate,
                            aggregate_name,
                        },
                        supplierList,
                    }));
                });
            }

            function buildMockWorksheetGenerateCreditCardTable() {
                spreadsheetMock.workSheet.cell.mockImplementation((row, col) => {
                    if (row === 54 && col === 2) {
                        return { value: 'CREDIT_CARD(Nubank)', isMerged: true, _mergeCount: 14 } as any;
                    }

                    if (row === 56 && col === 2) {
                        return { value: 'Credit Card Nubank Ifood', isMerged: false, _mergeCount: 0 } as any;
                    }

                    if (row === 59 && col === 2) {
                        return { value: 'Credit Card Nubank Ifood', isMerged: true, _mergeCount: 14 } as any;
                    }

                    if (row === 61 && col === 2) {
                        return {
                            value: 'Credit Card Nubank IFood Andre Vinicios Pereira',
                            isMerged: false,
                            _mergeCount: 0
                        } as any;
                    }

                    if (row === 62 && col === 2) {
                        return { value: 'Credit Card Nubank IFood Google One', isMerged: false, _mergeCount: 0 } as any;
                    }

                    if (row === 63 && col === 2) {
                        return {
                            value: 'Credit Card Nubank IFood Xique Xique',
                            isMerged: false,
                            _mergeCount: 0
                        } as any;
                    }

                    if (row === 64 && col === 2) {
                        return {
                            value: 'Credit Card Nubank IFood IFood Clube',
                            isMerged: false,
                            _mergeCount: 0
                        } as any;
                    }

                    if (row === 65 && col === 2) {
                        return {
                            value: 'Credit Card Nubank IFood Anjos Restaurante',
                            isMerged: false,
                            _mergeCount: 0
                        } as any;
                    }

                    return { value: '', isMerged: false, _mergeCount: 0 } as any;
                });
            }

            it('should correctly return a simple case (no parent/children).', () => {
                jest.spyOn(services, 'cleanTextByListText')
                    .mockImplementationOnce(() => 'Personal Expense 1');
                buildMockWorksheet([
                    {},
                    {},
                    { value: 'CREDIT_CARD(Nubank)' },
                    {},
                    { value: 'Expense 1' },
                    { value: 'TOTAL' },
                    {},
                ]);
                const startRow = 2;

                const result = business['generateCreditCardTable']({
                    bills: [mockBillEntity],
                    startRow,
                    groupName,
                    workSheet: spreadsheetMock.workSheet
                });
                expect(result.nextRow).toEqual(7);
                expect(result.data).toHaveLength(1);
                expect(result.data[0].january).toEqual(0);
                expect(result.data[0].january_paid).toBeFalsy();
                expect(result.data[0].name).toEqual('Personal Expense 1');
                expect(result.data[0].supplier).toEqual('Personal Expense 1');
                expect(result.data[0].aggregate_name).toEqual('');
                expect(result.data[0].is_aggregate).toBeFalsy();
                expect(result.data[0].paid).toBeFalsy();
                expect(result.data[0].total).toEqual(0);
            });

            it('should ignore missing bills.', () => {
                buildMockWorksheet([
                    {},
                    {},
                    { value: 'CREDIT_CARD(Nubank)' },
                    { value: 'TOTAL' },
                ]);
                const startRow = 2;

                const result = business['generateCreditCardTable']({
                    bills: [],
                    startRow,
                    groupName,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(result).toEqual({
                    data: [],
                    nextRow: 2 + 1
                });
            });

            it('should return empty list if regex doesnt match.', () => {
                buildMockWorksheet([
                    {},
                    {},
                    { value: 'invalid' },
                    { value: 'TOTAL' },
                ]);
                const startRow = 2;

                const result = business['generateCreditCardTable']({
                    bills: [],
                    startRow,
                    groupName,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(result).toEqual({
                    data: [],
                    nextRow: 2
                });
            });

            it('should process parents and children correctly (isMerged = true, _mergeCount > 2).', () => {

                buildCreditCardBodyDataMock([
                    {
                        name: 'Personal Credit Card Nubank Ifood',
                        supplier: 'Ifood',
                        is_aggregate: false,
                        aggregate_name: '',
                        supplierList: ['Ifood']
                    },
                    {
                        name: 'Personal Credit Card Nubank IFood Andre Vinicios Pereira',
                        supplier: 'Andre Vinicios Pereira',
                        is_aggregate: true,
                        aggregate_name: 'IFood',
                    },
                    {
                        name: 'Personal Credit Card Nubank IFood Google One',
                        supplier: 'Google One',
                        is_aggregate: true,
                        aggregate_name: 'IFood',
                    },
                    {
                        name: 'Personal Credit Card Nubank IFood Xique Xique',
                        supplier: 'Xique Xique',
                        is_aggregate: true,
                        aggregate_name: 'IFood',
                    },
                    {
                        name: 'Personal Credit Card Nubank IFood IFood Clube',
                        supplier: 'Clube',
                        is_aggregate: true,
                        aggregate_name: 'IFood IFood',
                    },
                    {
                        name: 'Personal Credit Card Nubank IFood Anjos Restaurante',
                        supplier: 'Anjos Restaurante',
                        is_aggregate: true,
                        aggregate_name: 'IFood',
                    }
                ]);

                buildMockWorksheetGenerateCreditCardTable();

                const result = business['generateCreditCardTable']({
                    bills: [mockBillEntity],
                    startRow: 54,
                    groupName,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(result.nextRow).toEqual(67);
                expect(result.data).toHaveLength(1);
                expect(result.data[0].children).toHaveLength(5);
            });

            it('should not add to acc when bodyData is false.', () => {
                jest.spyOn(business as any, 'buildCreditCardBodyData').mockImplementationOnce(() => ({
                    data: null,
                    supplierList: []
                }));

                buildMockWorksheetGenerateCreditCardTable();

                const result = business['generateCreditCardTable']({
                    bills: [mockBillEntity],
                    startRow: 54,
                    groupName: 'Personal',
                    workSheet: spreadsheetMock.workSheet
                });

                expect(result.data).toEqual([]);
            });

            it('should set bankName to "Bank" when regex does not capture the name.', () => {
                const originalMatch = String.prototype.match;

                String.prototype.match = function (regex) {
                    if (this === 'CREDIT_CARD(Nubank)') {
                        return [
                            'CREDIT_CARD(Nubank)',
                            'CREDIT_CARD',
                            undefined,
                        ];
                    }
                    return originalMatch.call(this, regex);
                };

                jest.spyOn(business as any, 'buildCreditCardBodyData').mockImplementationOnce(() => ({
                    data: { name: 'Some Name' },
                    supplierList: []
                }));

                spreadsheetMock.workSheet.cell.mockImplementation((row, col) => {
                    if (row === 1) {
                        return { value: 'CREDIT_CARD(Nubank)', isMerged: false, _mergeCount: 1 } as any;
                    }
                    return { value: '', isMerged: false, _mergeCount: 1 } as any;
                });


                const result = business['generateCreditCardTable']({
                    bills: [mockBillEntity],
                    startRow: 1,
                    groupName: 'Personal',
                    workSheet: spreadsheetMock.workSheet
                });

                String.prototype.match = originalMatch;

                expect(result.data).toEqual([]);
            });

        });
    });
});