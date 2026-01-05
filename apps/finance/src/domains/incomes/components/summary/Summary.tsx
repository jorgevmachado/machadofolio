import { useMemo } from 'react';

import { currencyFormatter } from '@repo/services';

import { type Income } from '@repo/business';

import { Text } from '@repo/ds';

import { useI18n } from '@repo/i18n';

import './Summary.scss';

type IncomeSummaryProps = {
  incomes: Array<Income>
}
export default function IncomeSummary({ incomes }: IncomeSummaryProps) {
  const { t } = useI18n();
  
  const total = useMemo(() => {
    const value = incomes.reduce((acc, curr) => acc + curr.total, 0);
    return `${t('total')}: ${currencyFormatter(value)}`;
  }, [incomes, t]);

  const paid = useMemo(() => {
    const allPaid = incomes.every(income =>
      income.months?.length
        ? income.months.every(month => month.paid)
        : false);
    return `${t('all_paid')}: ${allPaid ? t('yes') : t('no')}`;
  }, [incomes, t]);

  return (
    <div className="income-summary" data-testid="summary">
      <div className="income-summary__text">
        <Text
          tag="p"
          color="neutral-100"
          weight="bold"
          variant="medium"
        >
          {total}
        </Text>
        <Text
          tag="p"
          color="neutral-100"
          weight="bold"
          variant="medium"
        >
          {paid}
        </Text>
      </div>
    </div>
  );
}