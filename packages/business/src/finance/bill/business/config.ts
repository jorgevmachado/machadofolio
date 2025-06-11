import { EBillType } from '../enum';

import type { BodyData } from './types';

export const DEFAULT_BODY_DATA: BodyData =  {
    title: '',
    type: EBillType.CREDIT_CARD,
    january: 0,
    january_paid: false,
    february: 0,
    february_paid: false,
    march: 0,
    march_paid: false,
    april: 0,
    april_paid: false,
    may: 0,
    may_paid: false,
    june: 0,
    june_paid: false,
    july: 0,
    july_paid: false,
    august: 0,
    august_paid: false,
    september: 0,
    september_paid: false,
    october: 0,
    october_paid: false,
    november: 0,
    november_paid: false,
    december: 0,
    december_paid: false,
    total: 0,
    paid: false,
};
