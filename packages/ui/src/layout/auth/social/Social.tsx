import React from 'react';

import { Button } from '@repo/ds';

import './Social.scss';

type TSocialPlatform = 'google' | 'facebook' | 'github';

interface SocialMediaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    platform: TSocialPlatform;
    ariaLabel?: string;
}

export default function Social({
    label,
    platform,
    ariaLabel,
    ...props
}: SocialMediaProps) {
    return (
        <Button
            {...props}
            fluid
            icon={{ icon: platform }}
            tabIndex={0}
            aria-label={ariaLabel ?? label}
            className={`ui-social__${platform}`}
            data-testid={`ui-social-${platform}`}>
            {label}
        </Button>
    )
}