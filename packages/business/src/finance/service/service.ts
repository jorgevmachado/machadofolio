import { type Nest } from '../../api';

import Finance from '../finance';
import type { FinanceInfo } from '../types';
import { Bill } from '../bill';
import { Bank } from '../bank';
import { Group } from '../group';
import { Supplier } from '../supplier';
import { Expense } from '../expense';
import { SupplierType } from '../supplier-type';

export class FinanceService {
    constructor(private nest: Nest) {}

    public async initialize(): Promise<Finance> {
        return this.nest.finance.initialize().then((response) => new Finance(response));
    }

    public async find(): Promise<FinanceInfo> {
        return this.nest.finance.find().then((response) => {
            const { bills, banks, groups, finance, expenses, suppliers, supplierTypes, ...result  } = response;

            console.log('# => bills => ', bills);
            console.log('# => banks => ', banks);
            console.log('# => groups => ', groups);
            console.log('# => expenses => ', expenses);
            console.log('# => suppliers => ', suppliers);
            console.log('# => supplierTypes => ', supplierTypes);
            const x =  {
                ...result,
                bills: bills.map((bill) => new Bill(bill)),
                banks: banks.map((bank) => new Bank(bank)),
                groups: groups.map((group) => new Group(group)),
                finance: new Finance(finance),
                expenses: expenses.map((expense) => new Expense(expense)),
                suppliers: suppliers.map((supplier) => new Supplier(supplier)),
                supplierTypes: supplierTypes.map((type) => new SupplierType(type)),
            }
            console.log('# => x => bills => ', x.bills);
            console.log('# => x => banks => ', x.banks);
            console.log('# => x => groups => ', x.groups);
            console.log('# => x => expenses => ', x.expenses);
            console.log('# => x => suppliers => ', x.suppliers);
            console.log('# => x => supplierTypes => ', x.supplierTypes);
            return x;
        });
    }
}