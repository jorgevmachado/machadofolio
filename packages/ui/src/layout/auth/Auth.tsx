import React from 'react';

import { type TUser } from '@repo/business';

import { Link, type TContext, Text, joinClass } from '@repo/ds';

import { Form, Logo } from '../../components';

import Social from './social';

import './Auth.scss';

type LogoProps = React.ComponentProps<typeof Logo>;

type SocialMediaProps  = React.ComponentProps<typeof Social>;

type LinkProps = React.ComponentProps<typeof Link> & {
    order: number;
};

type FormProps = React.ComponentProps<typeof Form>;

interface AuthProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
    user?: TUser;
    type: FormProps['type'];
    logo?: LogoProps;
    links?: Array<LinkProps>;
    title?: string;
    context?: TContext;
    onSubmit?: FormProps['onSubmit'];
    infoText?: string;
    socialMedia?: Array<SocialMediaProps>;
    description?: string;
}

export default function Auth({
    user,
    type,
    logo,
    links,
    title,
    context = 'primary',
    onSubmit,
    infoText = '',
    socialMedia = [],
    description,
    className,
    ...props
}: AuthProps) {
    const isDescriptionLarge = (description?.length ?? 0) > 56;
    const hasSocialMedia = socialMedia?.length > 0;

    return (
        <div {...props} className={joinClass(['ui-auth', className ])} data-testid="ui-auth">
            { logo && <Logo {...logo} fit={logo?.fit ?? 'contain'}/>}
            { title && (
                <Text tag="h1" weight="bold" variant="xlarge" className="ui-auth__title" data-testid="ui-auth-title">
                    {title}
                </Text>
            )}
            { description && (
                <Text
                    tag="p"
                    variant="regular"
                    className={joinClass([
                        'ui-auth__description',
                        isDescriptionLarge && 'ui-auth__description--large',
                    ])}
                    data-testid="ui-auth-description"
                >
                    {description}
                </Text>
            )}
            {hasSocialMedia && (
                <div className="ui-auth__social-media" data-testid="ui-auth-social-media">
                    {socialMedia?.map((social) => (
                        <Social key={social.platform} {...social}/>
                    ))}
                </div>
            )}
            {infoText && (
                <div className="ui-auth__info-text" data-testid="ui-auth-info-text">
                    <hr className="ui-auth__info-text--line" aria-hidden={true} />
                    <Text className="ui-auth__info-text--content" data-testid="ui-auth-info-text-content">{infoText}</Text>
                    <hr className="ui-auth__info-text--line" aria-hidden={true} />
                </div>
            )}
            <Form user={user} type={type} context={context} onSubmit={onSubmit} />

            {links && (
                <div className="ui-auth__links" data-testid="ui-auth-links">
                    {links
                        ?.slice()
                        ?.sort((a, b) => a.order - b.order)
                        ?.map((link) => (
                            <Link
                                key={`${link.children}-${link.order}`}
                                {...link}
                                context={link.context ?? context}
                                data-testid={`ui-auth-link-${link.order}`}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};
