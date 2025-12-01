'use client'
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { DependencyFallback } from '@repo/ui';

import { useFinance } from '../../../../hooks';

type FallbackProps = {
    hasBills: boolean;
    hasAllDependencies: boolean;
}

type DependencyFallbackProps = React.ComponentProps<typeof DependencyFallback>;

export default function Fallback({
    hasBills,
    hasAllDependencies
}: FallbackProps) {
    const router = useRouter();
    const [ fallback, setFallback ] = useState<DependencyFallbackProps | undefined>(undefined);

    const { banks, groups, suppliers } = useFinance();

    const generateDependencyContent = ( plural: string, singular: string ) => {
        return {
            button: {
                label: `Create ${singular}`,
                onClick: () => router.push(`/${plural}`),
            },
            message: { text:`No ${plural} were found. Please create a ${singular} before creating a bill.`}
        };
    }

    const generateContent = (hasBills: boolean, hasAllDependencies: boolean) => {
        if(!hasBills && hasAllDependencies) {
            return { message: { text: 'No bills were found.' }};
        }

        if(groups.length === 0) {
            return generateDependencyContent('groups', 'group');
        }

        if(banks.length === 0) {
            return generateDependencyContent('banks', 'bank');
        }

        if(suppliers.length === 0) {
            return generateDependencyContent('suppliers', 'supplier');
        }

        return;
    };

    useEffect(() => {
        if(!fallback) {
            const content = generateContent(hasBills, hasAllDependencies);
            setFallback(content);
        }
    }, [hasBills, hasAllDependencies]);

    return !fallback ? null : (
        <DependencyFallback {...fallback} />
    )
}