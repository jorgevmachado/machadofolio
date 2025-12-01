'use client'
import React, { useEffect } from 'react';

import { useI18n } from '@repo/i18n';

import { EGender } from '@repo/services';

import { FinanceInfo as FinanceInfoProps, User } from '@repo/business';

import { Text } from '@repo/ds';

import { BankInfo, DistributionOfExpenses, FinanceInfo, GroupInfo, PaymentMethodsInfo, SupplierInfo } from './charts';

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
            if(language === 'pt-BR') {
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

        }
        const linkingWord = getLinkingWord(user.gender, language);
        return `${text} ${linkingWord} ${user.name}`;
    }

    useEffect(() => {
        const text = t('title');
        const newTitle = treatTitle(finance.user, text, lang);
        setTitle(newTitle);
    }, [t, lang]);

    return (
        <div className="finance-info" data-testid="finance-info">
            <header className="finance-info__header">
                <Text tag="h1" variant="giant" color="primary-100">{title}</Text>
            </header>
            <div className="finance-info__content">
                <section>
                    <FinanceInfo
                        total={total}
                        totalPaid={totalPaid}
                        className="finance-info__content--group-item"
                        totalPending={totalPending}
                        totalRegisteredExpenses={expenses.length}
                    />
                </section>
                <section className="finance-info__content--group">
                    <SupplierInfo
                        expenses={expenses}
                        className="finance-info__content--group-item"
                        totalRegisteredSuppliers={suppliers.length}
                    />
                    <GroupInfo
                        bills={bills}
                        className="finance-info__content--group-item"
                        totalRegisteredGroups={groups.length}
                    />
                </section>
                <section className="finance-info__content--group">
                    <DistributionOfExpenses expenses={expenses} className="finance-info__content--group-item"/>
                </section>
                <section className="finance-info__content--group">
                    <BankInfo
                        bills={bills}
                        className="finance-info__content--group-item"
                        totalRegisteredBanks={banks.length}
                    />
                    <PaymentMethodsInfo
                        bills={bills}
                        className="finance-info__content--group-item"
                        totalRegisteredBills={bills.length}
                    />
                </section>
            </div>
        </div>
    )
}