import type Bill from '../bill';
import type Expense from '../../expense';

export default class BillBusiness {

    calculate(bill: Bill): Bill {
        if(bill?.expenses?.length) {
            bill.total = this.sumTotalExpenses(bill.expenses, 'total');
            bill.total_paid = this.sumTotalExpenses(bill.expenses, 'total_paid');
            bill.all_paid = bill.expenses.every((expense) => expense.paid);
        }
        return bill;
    }

    private sumTotalExpenses(expenses: Array<Expense>, property: 'total' | 'total_paid') {
        return expenses.reduce((acc, expense) => acc + (expense[property] ?? 0), 0);
    }
}