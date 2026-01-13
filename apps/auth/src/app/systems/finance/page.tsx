'use client';
import { useCallback ,useEffect ,useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button, Text } from '@repo/ds';

import { useAuthUrl } from '../../../shared';

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

  const { currentUrl, currentSystemUrl } = useAuthUrl('finance');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const redirectToPage = useCallback((page: string) => {
    if (/^http?:\/\//.test(page)) {
      window.location.href = page;
    } else {
      router.push(page);
    }
  }, [router]);

  useEffect(() => {
    if (!isMounted) return;
    const redirectTo = searchParams.get('redirectTo');
    if (redirectTo) {
      if (!currentUrl.includes(redirectTo)) {
        redirectToPage(redirectTo);
      }
    }
  }, [searchParams, isMounted, currentUrl, redirectToPage]);

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
      <Button context="primary" onClick={() => redirectToPage(currentSystemUrl)}>
                Ir para o Sistema de Finanças
      </Button>
    </div>
  );
}