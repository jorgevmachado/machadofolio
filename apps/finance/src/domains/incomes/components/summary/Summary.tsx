import { Text } from '@repo/ds';

import { useI18n } from '@repo/i18n';

import { useIncomes } from '../../hooks';

import './Summary.scss';

export default function IncomeSummary() {
  const { t } = useI18n();

  const {
    allPaid,
    allTotal
  } = useIncomes();

  return (
    <div className="income-summary" data-testid="summary">
      <div className="income-summary__text">
        <Text
          tag="p"
          color="neutral-100"
          weight="bold"
          variant="medium"
        >
          {`${t('total')}: ${allTotal}`}
        </Text>
        <Text
          tag="p"
          color="neutral-100"
          weight="bold"
          variant="medium"
        >
          {`${t('all_paid')}: ${allPaid ? t('yes') : t('no')}`}
        </Text>
      </div>
    </div>
  );
}