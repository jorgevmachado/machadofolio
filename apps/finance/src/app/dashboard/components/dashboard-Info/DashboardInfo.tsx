'use client'
import React from 'react';

import { EGender } from '@repo/services';

import { FinanceInfo as FinanceInfoProps, User } from '@repo/business';

import { Text } from '@repo/ds';

import { BankInfo, DistributionOfExpenses, FinanceInfo, GroupInfo, PaymentMethodsInfo, SupplierInfo } from '../charts';

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
    const treatTitle = (user: User) => {
        const getLinkingWord = (gender: EGender) => {
            switch (gender) {
                case EGender.MALE:
                    return 'do';
                case EGender.FEMALE:
                    return 'da';
                default:
                    return 'do(a)';
            }
        }
        const linkingWord = getLinkingWord(user.gender);
        return `Finanças ${linkingWord} ${user.name}`;
    }

    return (
        <div className="finance-info" data-testid="finance-info">
            <header className="finance-info__header">
                <Text tag="h1" variant="giant" color="primary-100">{treatTitle(finance.user)}</Text>
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
                    <SupplierInfo expenses={expenses} totalRegisteredSuppliers={suppliers.length}
                                  className="finance-info__content--group-item"/>
                    <GroupInfo bills={bills} totalRegisteredGroups={groups.length}
                               className="finance-info__content--group-item"/>
                </section>
                <section className="finance-info__content--group">
                    <DistributionOfExpenses expenses={expenses} className="finance-info__content--group-item"/>
                </section>
                <section className="finance-info__content--group">
                    <BankInfo bills={bills} totalRegisteredBanks={banks.length}
                              className="finance-info__content--group-item"/>
                    <PaymentMethodsInfo bills={bills} totalRegisteredBills={bills.length}
                                        className="finance-info__content--group-item"/>
                </section>
            </div>
        </div>
    )
}