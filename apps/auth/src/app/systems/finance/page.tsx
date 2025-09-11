'use client'
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button, Text } from '@repo/ds';

import './page.scss';


const financeFeatures = [
    'Cadastre e categorize suas receitas e despesas',
    'Visualize relatórios detalhados e gráficos interativos',
    'Defina metas financeiras e acompanhe seu progresso',
    'Controle múltiplas contas e cartões',
];

export default function FinancePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const redirectToPage = (page: string) => {
        if (/^http?:\/\//.test(page)) {
            window.location.href = page;
        } else {
            router.push(page);
        }
    }

    useEffect(() => {
        if (!isMounted) return;
        const redirectTo = searchParams.get('redirectTo');
        if (redirectTo) {
            const currentUrl = window.location.href;
            if (!currentUrl.includes(redirectTo)) {
                redirectToPage(redirectTo);
            }
        }
    }, [searchParams, isMounted]);

    return (
        <div className="page-finance">
            <div>
                <Text id="title" tag="h1" variant="giant" color="primary-80" weight="bold">Sistema de Finanças</Text>
                <Text id="subtitle" color="neutral-100" variant="medium" weight="regular">
                    O sistema de finanças é uma solução completa para gestão financeira pessoal e empresarial. Com ele, você pode acompanhar receitas, despesas, criar relatórios, definir metas e visualizar gráficos para tomar decisões mais inteligentes sobre seu dinheiro.
                </Text>
                <ul>
                    {financeFeatures.map((text, idx) => (
                        <li key={idx} id={`feature-item-${idx}`}>
                            <Text id={`feature-text-${idx}`} color="neutral-100" variant="medium" weight="regular">
                                {text}
                            </Text>
                        </li>
                    ))}
                </ul>
                <Text id="description" color="neutral-100" variant="medium" weight="regular">
                    Para começar a usar, clique no botão abaixo e acesse o sistema de finanças. O ambiente é intuitivo e seguro, pensado para facilitar sua rotina financeira.
                </Text>
            </div>
            <Button context="primary" onClick={() => redirectToPage('http://localhost:4002')}>
                Ir para o Sistema de Finanças
            </Button>
        </div>
    )
}