'use client'
import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button, Text } from '@repo/ds';

import './page.scss';

const lawFeatures = [
    'Acesse conteúdos sobre temas jurídicos e legislação',
    'Receba análises e dicas para aprimorar seu currículo jurídico',
    'Participe de networking com profissionais do Direito',
    'Fique por dentro de eventos, oportunidades e notícias do setor',
];

export default function LawPage() {
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
        if (!isMounted) {
            return;
        }
        const redirectTo = searchParams.get('redirectTo');
        if (redirectTo) {
            redirectToPage(redirectTo);
        }
    }, [searchParams, isMounted]);

    return (
        <div className="page-law">
            <div>
                <Text id="title" tag="h1" variant="giant" color="primary-80" weight="bold">Sistema Jurídico</Text>
                <Text id="subtitle" color="neutral-100" variant="medium" weight="regular">
                    O sistema jurídico é um ambiente completo para quem busca conhecimento, oportunidades e networking na área do Direito. Encontre conteúdos relevantes, dicas de carreira e conecte-se com profissionais do setor.
                </Text>
                <ul>
                    {lawFeatures.map((text, idx) => (
                        <li key={idx} id={`feature-item-${idx}`}>
                            <Text id={`feature-text-${idx}`} color="neutral-100" variant="medium" weight="regular">
                                {text}
                            </Text>
                        </li>
                    ))}
                </ul>
                <Text id="description" color="neutral-100" variant="medium" weight="regular">
                    Para começar sua jornada jurídica, clique no botão abaixo e acesse o sistema. O ambiente é moderno, interativo e pensado para estudantes, advogados e profissionais do Direito.
                </Text>
            </div>
            <Button context="primary" onClick={() => redirectToPage('http://localhost:4004')}>Acessar Sistema Jurídico</Button>
        </div>
    )
}