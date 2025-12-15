import React ,{ useEffect ,useMemo ,useState } from 'react';

import { currencyFormatter } from '@repo/services';

import { Button ,Text } from '@repo/ds';

import type { Expense } from '@repo/business';
import { useI18n } from '@repo/i18n';

import { type AllCalculated ,useExpenses } from '../../hooks';

import type {
  ItemCalculationSummary
} from './types';

type SummaryProps = {
  action?: () => void;
  expenses?: Array<Expense>;
}

export default function Summary({ action, expenses = [] }: SummaryProps) {
  const { t } = useI18n();

  const { calculateAllExpenses } = useExpenses();

  const [allCalculated, setAllCalculated] = useState<AllCalculated | undefined>(undefined);

  const itemSummary = useMemo(() => {
    if (!allCalculated) {
      return [];
    }
    const { total, totalPaid, allPaid, totalPending } = allCalculated;
    return [
      {
        key: 'paid',
        label: t('add_expense'),
        value: {
          label: allPaid ? t('yes') : t('no'),
          color: allPaid ? 'success-80' : 'error-80'
        }
      },
      {
        key: 'total',
        label: 'Total: ',
        value: {
          label: currencyFormatter(total),
        }
      },
      {
        key: 'total_paid',
        label: `Total ${t('paid')}:`,
        value: {
          label: currencyFormatter(totalPaid),
        }
      },
      {
        key: 'total_pending',
        label: `Total ${t('pending')}:`,
        value: {
          label: currencyFormatter(totalPending),
        }
      }
    ] as Array<ItemCalculationSummary>;
  }, [allCalculated, t]);

  useEffect(() => {
    const allCalculated = calculateAllExpenses(expenses);
    setAllCalculated(allCalculated);
  }, [calculateAllExpenses, expenses]);

  return allCalculated ? (
    <div className="summary" data-testid="summary">
      <div className="summary__text" data-testid="summary-text">
        {itemSummary.map((item, index) => (
          <div key={item.key} className="summary__text--item" data-testid={`summary-text-item-${index}`}>
            <Text
              id={`calculation-summary-item-label-${item.key}`}
              tag="p"
              color="neutral-100"
              weight="bold"
              variant="medium"
              data-testid={`calculation-summary-item-label-${item.key}`}>
              {item.key === 'paid' ? `${item.label}:` : `${item.label}`}
            </Text>
            <Text
              id={`calculation-summary-item-value-${item.key}`}
              tag="p"
              color={item.value?.color ?? 'neutral-100'}
              variant="medium"
              data-testid={`calculation-summary-item-value-${item.key}`}>
              {item.value.label}
            </Text>
          </div>
        ))}
      </div>
      <div className="calculation-summary__action">
        <Button onClick={action} context="success">
          {t('add_expense')}
        </Button>
      </div>
    </div>
  ) : null;
}