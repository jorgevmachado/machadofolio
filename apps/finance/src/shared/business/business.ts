import {
  BillBusiness ,
  ExpenseBusiness ,
  IncomeBusiness ,
  MonthBusiness,
} from '@repo/business';

export const billBusiness = new BillBusiness();
export const expenseBusiness = new ExpenseBusiness();
export const monthBusiness = new MonthBusiness();
export const incomeBusiness = new IncomeBusiness();