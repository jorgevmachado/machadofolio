import React from 'react';

import { joinClass,Text } from '@repo/ds';

import { Fade } from '../../animations';

import './Content.scss';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    children: React.ReactNode;
    isSidebarOpen?: boolean;
    withAnimation?: boolean;
}

export default function Content({
    title,
    children,
    className,
    isSidebarOpen = true,
    withAnimation = false,
    ...props
}: ContentProps) {

    const Wrapper = withAnimation ? Fade : React.Fragment;

    const classNameList = joinClass([
        'ui-content',
        isSidebarOpen ? 'ui-content__sidebar--open' : 'ui-content__sidebar--closed',
        className ?? ''
    ]);

    return (
        <Wrapper {...(withAnimation && { enter: true })}>
            <div {...props} className={classNameList} data-testid="ui-content">
                { title && (
                    <Text tag="h1" color="navbar-background">
                        {title}
                    </Text>
                )}
                {children}
            </div>
        </Wrapper>
    );
};
