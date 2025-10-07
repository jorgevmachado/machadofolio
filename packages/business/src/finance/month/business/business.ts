import { EMonth, getCurrentMonthNumber, MONTHS, TMonth } from '@repo/services';

import { MonthsCalculated, MonthsObject, PersistMonthParams } from '../types';
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

    public calculateAll(months?: Array<Month>): MonthsCalculated {
        const monthsCalculated: MonthsCalculated = {
            total: 0,
            allPaid: false,
            totalPaid: 0,
            totalPending: 0
        }

        if(!months || months?.length <= 0) {
            return monthsCalculated;
        }

        monthsCalculated.allPaid = months.every((month) => month.paid);
        const total = months.reduce((acc, item) => acc + item.value, 0);
        const total_paid = months.reduce((acc, item) => acc + (item.paid ? item.value : 0), 0);
        monthsCalculated.total = Number(total.toFixed(2));
        monthsCalculated.totalPaid = Number(total_paid.toFixed(2));
        const totalPending = total - total_paid;
        monthsCalculated.totalPending = Number(totalPending.toFixed(2));
        return monthsCalculated;
    }

    public convertMonthsToObject(months?: Array<Month>): MonthsObject {
        const initialObjectMonths: MonthsObject = {
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
        };

        if(!months || months?.length <= 0) {
            return initialObjectMonths;
        }

        return months?.reduce((acc, month) => {
            const currentMonth = month.label.toLowerCase() as TMonth;
            acc[currentMonth] = month.value;
            acc[`${currentMonth}_paid`] = month.paid;
            return acc;
        }, initialObjectMonths);
    }

    public calculateByMonth(month: Month, months?: Array<Month>): Month {
        if(!months || months?.length <= 0) {
            return month;
        }
        const currentMonths = months.filter((m) => m.label === month.label);

        if(currentMonths.length <= 0) {
            return month;
        }

        const { total, allPaid } = this.calculateAll(currentMonths);
        return {
            ...month,
            paid: allPaid,
            value: total,
        };
    }

    public totalByMonth(month: string = 'january', months: Array<Month> = []): number {
        if(!months || months?.length <= 0) {
            return 0;
        }
        const code = getCurrentMonthNumber(month);
        const foundMonths = months.filter(m => m.code === code);
        const { total } = this.calculateAll(foundMonths);
        return total;
    }
}