import { type Nest } from '../../api';

import Finance from '../finance';

export class FinanceService {
    constructor(private nest: Nest) {}

    public async initialize(): Promise<Finance> {
        return this.nest.finance.initialize().then((response) => new Finance(response));
    }
}