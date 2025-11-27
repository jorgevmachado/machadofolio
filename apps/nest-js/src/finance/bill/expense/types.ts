import { type SeedsGenerated } from '../../../shared';

import { Expense } from '../../entities/expense.entity';
import { Month } from '../../entities/month.entity';


export type GeneratedExpenseSeeds = {
    months: Array<Month>;
    expenses: SeedsGenerated<Expense>;
}