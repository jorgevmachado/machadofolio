import { type SeedsGenerated } from '../../../shared';
import { type Expense } from '../../entities/expense.entity';
import { type Month } from '../../entities/month.entity';


export type GeneratedExpenseSeeds = {
    months: Array<Month>;
    expenses: SeedsGenerated<Expense>;
}