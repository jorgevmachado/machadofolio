'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { currencyFormatter, EGender } from '@repo/services';

import { EExpenseType, FinanceInfo, User } from '@repo/business';

import { Button, Card, Text } from '@repo/ds';

import './DashboardInfo.scss';

type FinanceInfoProps = FinanceInfo;

type TContent = {
    key: string;
    text: string;
    path?: string;
    value: number;
    total?: number;
    title: string;
    plural: string;
    allPaid?: boolean;
    singular: string;
    isFemale?:boolean
    totalPaid?: number;
    hasOptionals?: boolean;
    totalPending?: number;
}

type TGroupContent = {
    key: string;
    content: Array<TContent>;
}

const DEFAULT_GROUPS: Array<TGroupContent> = [
    {
        key: 'group_1',
        content: [
            {
                key: 'bank',
                path: '/banks',
                text: '',
                value: 0,
                title: 'Bancos',
                plural: 'bancos',
                singular: 'banco',
            },
            {
                key: 'group',
                path: '/groups',
                text: '',
                value: 0,
                title: 'Grupos',
                plural: 'grupos',
                singular: 'grupo',
            },
            {
                key: 'supplier',
                path: '/suppliers',
                text: '',
                value: 0,
                title: 'Fornecedores',
                plural: 'fornecedores',
                singular: 'fornecedor',
            },
        ]
    },
    {
        key: 'group_2',
        content: [
            {
                key: 'supplier-type',
                path: '/suppliers/types',
                text: '',
                value: 0,
                title: 'Tipos de Fornecedor',
                plural: 'tipos de fornecedores',
                singular: 'tipo de fornecedor',
            },
            {
                key: 'bill',
                path: '/bills',
                text: '',
                value: 0,
                title: 'Contas',
                plural: 'contas',
                singular: 'conta',
                isFemale: true,
            },
            {
                key: 'expense',
                text: '',
                title: 'Despesas',
                value: 0,
                plural: 'despesas',
                singular: 'despesa',
                isFemale: true,
                hasOptionals: true,
            }
        ]
    }
];

export default function DashboardInfo({
    bills,
    banks,
    total,
    groups,
    allPaid,
    finance,
    expenses,
    totalPaid,
    suppliers,
    totalPending,
    supplierTypes
}: FinanceInfoProps) {
    const router = useRouter();
    const [contentGroups, setContentGroups] = useState<Array<TGroupContent>>(DEFAULT_GROUPS);

    const treatText = (value: number, singular: string, plural: string, isFemale: boolean = false) => {
        const lastWord = isFemale ? 'cadastrada' : 'cadastrado'
        if(value === 0) {
            return `${isFemale ? 'Nenhuma' : 'Nenhum'} ${singular} ${lastWord}`;
        }
        if(value === 1) {
            return `${value} ${singular} ${lastWord}`;
        }
        return `${value} ${plural} ${lastWord}s`;
    }

    const treatValue = (type: string,) => {
        switch (type) {
            case 'bill':
                return bills.length;
            case 'bank':
                return banks.length;
            case 'group':
                return groups.length;
            case 'supplier':
                return suppliers.length;
            case 'expense':
                return expenses.length;
            case 'supplier-type':
                return supplierTypes.length;
            default:
                return 0;
        }
    }

    const generateContent = () => {
        const currentGroups =  contentGroups.map((group) => ({
            ...group,
            content: group.content.map((content) => {
                content.text = treatText(content.value, content.singular, content.plural, content?.isFemale);
                content.value = treatValue(content.key);
                if(content.hasOptionals) {
                    content.total = total;
                    content.allPaid = allPaid;
                    content.totalPaid = totalPaid;
                    content.totalPending = totalPending;
                }
                return content;
            })
        }));
        setContentGroups(currentGroups);
    }

    useEffect(() => {
        generateContent();
    }, []);

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
        const linkingWord =   getLinkingWord(user.gender);
        return `Finanças ${linkingWord} ${user.name}`;
    }

    return (
        <div className="finance-info" data-testid="finance-info">
            <header className="finance-info__header">
                <Text tag="h1" variant="giant" color="primary-100">{treatTitle(finance.user)}</Text>
            </header>
            <div className="finance-info__content">
                {contentGroups.map((group) => (
                    <section key={group.key} className="finance-info__content--group">
                        {group.content.map((content) => (
                            <Card key={content.key} className="finance-info__content--group-item">
                                <Text tag="h2" variant="large" color="primary-60" weight="bold">
                                    {content.title}
                                </Text>
                                <Text variant="medium" color="neutral-80">
                                    {content.text}
                                </Text>
                                {content.path && (
                                        <Button
                                            size="small"
                                            context="primary"
                                            onClick={() => router.push(content.path as string)}>
                                            Ver Detalhes
                                        </Button>
                                )}
                                { content.hasOptionals && (
                                    <>
                                        <Text variant="medium" color="neutral-80">
                                            <strong> Total:</strong> {currencyFormatter(content?.total ?? 0)}
                                        </Text>
                                        <Text variant="medium" color="neutral-80">
                                            <strong> Total
                                                Pago:</strong> {currencyFormatter(content?.totalPaid ?? 0)}
                                        </Text>
                                        <Text variant="medium" color="neutral-80">
                                            <strong> Total
                                                Pendente:</strong> {currencyFormatter(content?.totalPending ?? 0)}
                                        </Text>
                                    </>
                                )}
                            </Card>
                        ))}
                    </section>
                ))}
            </div>
            <div className="finance-info__content">
                <section className="finance-info__content--group">
                    <Card className="finance-info__content--group-item">
                        <Text tag="h2" variant="large" color="primary-60" weight="bold">
                            Despesas
                        </Text>
                        <Text variant="medium" color="neutral-80">
                            Fixos: {expenses.filter((item) => item.type === EExpenseType.FIXED).length}
                        </Text>
                        <Text variant="medium" color="neutral-80">
                            Variáveis: {expenses.filter((item) => item.type === EExpenseType.VARIABLE).length}
                        </Text>
                    </Card>
                </section>
            </div>
        </div>
    )
}