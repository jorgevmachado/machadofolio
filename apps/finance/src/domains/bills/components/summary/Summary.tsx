'use client';
import React ,{ useEffect ,useState } from 'react';

import { currencyFormatter } from '@repo/services';

import { Button, Text } from '@repo/ds';

import type { Bill } from '@repo/business';
import { useI18n } from '@repo/i18n';

import type { ItemCalculationSummary } from './types';

import './Summary.scss';

type ActionProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export type CalculationSummaryProps = {
  list?: Array<Bill>;
  total: number;
  action?: ActionProps;
  allPaid: boolean;
  totalPaid: number;
  allPaidLabel?: string;
  totalPending: number;
};

export default function Summary({
  total,
  action,
  allPaid,
  totalPaid,
  allPaidLabel = 'All Paid',
  totalPending,
}: CalculationSummaryProps) {

  const [itemSummary, setItemSummary] = useState<Array<ItemCalculationSummary>>([]);

  const { t } = useI18n();

  const buildItemSummary = () => {
    const item: Array<ItemCalculationSummary> = [
      {
        key: 'paid',
        label: allPaidLabel === 'All Paid' ? t('all_paid'): allPaidLabel,
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
    ];
    setItemSummary(item);
  };

  useEffect(() => {
    buildItemSummary();
  }, [t, total, totalPaid, allPaid, totalPending]);

  return (
    <div className="summary" data-testid="summary">
      <div className="summary__text">
        {itemSummary.map((item) => (
          <div key={item.key} className="summary__text--item">
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
      {action && (
        <div className="summary__action">
          <Button onClick={action.onClick} context="success">
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}