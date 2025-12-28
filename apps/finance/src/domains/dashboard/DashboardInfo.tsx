/**
 * Created by jorge.machado as 10/12/2025
 **/
'use client';
import React ,{ useEffect } from 'react';

import { EGender } from '@repo/services';

import { Text } from '@repo/ds';

import type {
  FinanceInfo as FinanceInfoProps,
  User
} from '@repo/business';
import { useI18n } from '@repo/i18n';

import ChartBankInfo from './ChartBankInfo';
import ChartDistributionOfExpenses from './ChartDistributionOfExpenses';
import ChartFinanceInfo from './ChartFinanceInfo';
import ChartGroupInfo from './ChartGroupInfo';
import ChartPaymentMethodsInfo from './ChartPaymentMethodsInfo';
import ChartSupplierInfo from './ChartSupplierInfo';
import OverviewBills from './OverviewBills';

import './DashboardInfo.scss';

export default function DashboardInfo({
  bills,
  banks,
  total,
  groups,
  finance,
  expenses,
  totalPaid,
  suppliers,
  totalPending,
}: FinanceInfoProps) {
  const { t, lang } = useI18n();
  const [title, setTitle] = React.useState<string>('');
  const treatTitle = (user: User, text: string, language: string) => {
    const getLinkingWord = (gender: EGender, language: string) => {
      if (language === 'pt-BR') {
        switch (gender) {
          case EGender.MALE:
            return 'do';
          case EGender.FEMALE:
            return 'da';
          default:
            return 'do(a)';
        }
      }
      return 'of';

    };
    const linkingWord = getLinkingWord(user.gender, language);
    return `${text} ${linkingWord} ${user.name}`;
  };

  useEffect(() => {
    const text = t('title');
    const newTitle = treatTitle(finance.user, text, lang);
    setTitle(newTitle);
  }, [t, lang, finance.user]);

  return (
    <div className="finance-info" data-testid="finance-info">
      <header className="finance-info__header">
        <Text tag="h1" variant="giant" color="primary-100">{title}</Text>
      </header>
      <div className="finance-info__content">
        {
          !(total === 0 && totalPaid === 0 && totalPending === 0) && (
            <section>
              <ChartFinanceInfo
                total={total}
                totalPaid={totalPaid}
                className="finance-info__content--group-item"
                totalPending={totalPending}
                totalRegisteredExpenses={expenses.length}
              />
            </section>
          )
        }
        {bills?.length > 0 && (
          <section className="finance-info__content--group">
            <OverviewBills bills={bills}/>
          </section>
        )}
        <section className="finance-info__content--group">
          <ChartBankInfo
            bills={bills}
            className="finance-info__content--group-item"
            totalRegisteredBanks={banks.length}
          />
          <ChartGroupInfo
            bills={bills}
            className="finance-info__content--group-item"
            totalRegisteredGroups={groups.length}
          />
        </section>

        {expenses.length > 0 && (
          <section className="finance-info__content--group">
            <ChartDistributionOfExpenses expenses={expenses} className="finance-info__content--group-item finance-info__distribuition-expense"/>
          </section>
        )}

        <section className="finance-info__content--group">
          {(banks.length > 0 && groups.length > 0) && (
            <ChartSupplierInfo
              expenses={expenses}
              className="finance-info__content--group-item"
              totalRegisteredSuppliers={suppliers.length}
            />
          )}
          {
            bills?.length > 0 && (
              <ChartPaymentMethodsInfo
                bills={bills}
                className="finance-info__content--group-item"
                totalRegisteredBills={bills.length}
              />
            )
          }
        </section>
      </div>
    </div>
  );
}