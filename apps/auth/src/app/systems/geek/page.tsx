'use client'
import { useEffect, useState } from 'react';

import { Button, Text } from '@repo/ds';

import './page.scss';

import { useRouter, useSearchParams } from 'next/navigation';


const geekFeatures = [
    'Explore o universo dos games, filmes, séries e quadrinhos',
    'Receba recomendações personalizadas de cultura nerd',
    'Participe de quizzes, desafios e rankings geek',
    'Descubra eventos, lançamentos e notícias do mundo geek',
];

export default function GeekPage() {
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
        <div className="page-geek">
            <div>
                <Text id="title" tag="h1" variant="giant" color="primary-80" weight="bold">Universo Geek</Text>
                <Text id="subtitle" color="neutral-100" variant="medium" weight="regular">
                    Mergulhe no universo geek: tecnologia, cultura nerd, games, filmes, séries, quadrinhos e muito mais! Descubra conteúdos exclusivos, participe de comunidades e fique por dentro das novidades do mundo geek.
                </Text>
                <ul>
                    {geekFeatures.map((text, idx) => (
                        <li key={idx} id={`feature-item-${idx}`}>
                            <Text id={`feature-text-${idx}`} color="neutral-100" variant="medium" weight="regular">
                                {text}
                            </Text>
                        </li>
                    ))}
                </ul>
                <Text id="description" color="neutral-100" variant="medium" weight="regular">
                    Para começar sua jornada geek, clique no botão abaixo e acesse o universo nerd. O ambiente é divertido, interativo e feito para apaixonados por cultura pop!
                </Text>
            </div>
            <Button context="primary" onClick={() => redirectToPage('http://localhost:4003')}>Acessar Universo Geek</Button>
        </div>
    )
}