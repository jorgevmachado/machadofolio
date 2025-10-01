import { EMonth, getCurrentMonthNumber, MONTHS } from '@repo/services';

import type { PersistMonthParams } from '../types';
import Month from '../month';


type GeneratePersistMonthParams = {
    year?: number;
    paid?: boolean;
    value?: number;
    month?: EMonth;
    received_at?: Date;
}

type GeneratePersistListMonthParams = GeneratePersistMonthParams & {
    months?: Array<PersistMonthParams>;
};

type GenerateMonthListCreationParams = GeneratePersistListMonthParams;

export default class MonthBusiness {
    public generateMonthListUpdateParameters(months?: Array<Month>, monthsToPersist?: Array<PersistMonthParams>): Array<PersistMonthParams> | undefined {
        if ((months && months?.length > 0) && (monthsToPersist && monthsToPersist?.length > 0)) {
            const monthList = monthsToPersist?.filter((m) => {
                if (!m.code && !m.month) {
                    return false;
                }
                const key: 'code' | 'label' = m.code ? 'code' : 'label';
                const existing = months?.find((item) => item[key] === m[key]);
                if (!existing) {
                    return true;
                }
                return existing.value !== m.value || existing.paid !== m.paid;
            });
            if (monthList.length <= 0) {
                return;
            }
            return monthList;
        }
        return;

    }

    public generatePersistMonthParams(params: GeneratePersistMonthParams): PersistMonthParams {
        const month =  params?.month || EMonth.JANUARY;
        return {
            year: params?.year,
            paid: params?.paid,
            code: getCurrentMonthNumber(month),
            value: params?.value || 0,
            month,
            received_at: params?.received_at || new Date(),
        }
    }

    public generatePersistListMonthParams({ months, ...params}: GeneratePersistListMonthParams): Array<PersistMonthParams> {
        if(months && months?.length > 0) {
            return months.map((m) => {
                if(!m.code && m.month) {
                    m.code = getCurrentMonthNumber(m.month);
                }
                if(!m.code && m.label) {
                    m.code = getCurrentMonthNumber(m.label);
                }
                if(m.code && !m.month) {
                    m.month = MONTHS?.[ m.code - 1]?.toUpperCase() as EMonth;
                }
                return m;
            });
        }
        return [this.generatePersistMonthParams(params)];
    }

    public generateMonthListCreationParameters(params: GenerateMonthListCreationParams): Array<PersistMonthParams> {
        const months = this.generatePersistListMonthParams(params);
        return MONTHS.map((month) => {
            const code = getCurrentMonthNumber(month);
            const monthParams = months.find((m) => m?.code === code);
            if(!monthParams) {
                return {
                    year: params?.year,
                    paid: params?.paid,
                    code,
                    value: 0,
                    month: month.toUpperCase() as EMonth,
                    received_at: params?.received_at || new Date(),
                }
            }
            return monthParams;
        })
    }
}