import type { Expense } from '../../expense';

import type Bill from '../bill';

import { BillSpreadsheetBusiness } from './spreadsheet';
import { type BillList, } from './types';

export default class BillBusiness {
    private readonly spreadsheetBusiness: BillSpreadsheetBusiness;

    constructor() {
        this.spreadsheetBusiness = new BillSpreadsheetBusiness();
    }

    public get spreadsheet(): BillSpreadsheetBusiness {
        return this.spreadsheetBusiness;
    }

    public calculate(bill: Bill): Bill {
        if (bill?.expenses?.length) {
            bill.total = this.sumTotalExpenses(bill.expenses, 'total');
            bill.total_paid = this.sumTotalExpenses(bill.expenses, 'total_paid');
            bill.all_paid = bill.expenses.every((expense) => expense.paid);
        }
        return bill;
    }

    public mapBillListByFilter(bills: Array<Bill>, type: BillList['type']): Array<BillList> {
        return bills.reduce<Array<BillList>>((groupedBills, currentBill) => {
            const title = this.getItemTitle(currentBill, type);
            let item = groupedBills.find((item) => item.title === title);
            if (!item) {
                item = { title, list: [], type };
                groupedBills.push(item);
            }
            item.list.push(currentBill);
            return groupedBills;
        }, []);
    }

    private getItemTitle(bill: Bill, type: BillList['type']): string {
        switch (type) {
            case 'bank':
                return bill.bank.name;
            case 'type':
                return bill.type.toLowerCase().replace(/ /g, '_');
            case 'group':
            default:
                return bill.group.name;
        }
    }

    private sumTotalExpenses(expenses: Array<Expense>, property: 'total' | 'total_paid'): number {
        return expenses.reduce((acc, expense) => acc + (expense[property] ?? 0), 0);
    }

}