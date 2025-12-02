import React, { useEffect, useRef, useState } from 'react';

import { joinClass, type TContext } from '../../utils';

import Button from '../button';

import Dots from './dots';
import Numbers from './numbers';

import './Pagination.scss';

type PaginationProps = {
    hide?: boolean;
    type?: 'numbers' | 'dots';
    total: number;
    range?: number;
    fluid?: boolean;
    current?: number;
    context?: TContext;
    disabled?: boolean;
    limitDots?: boolean;
    handleNew?(newPage: number): void;
    handleNext?(): void;
    handlePrev?(): void;
    hideButtons?: boolean;
}

export default function Pagination({
    hide,
    type = 'dots',
    total,
    range,
    fluid,
    current = 1,
    context = 'primary',
    disabled,
    limitDots,
    handleNew,
    handleNext,
    handlePrev,
    hideButtons,
}: PaginationProps) {
    const [selectedPage, setSelectedPage] = useState<number>(current);

    const notInitialRender = useRef(false);

    const classNameList = joinClass([
        'ds-pagination',
        fluid && 'ds-pagination__fluid',
    ]);

    const paginationItemsClassNameList = joinClass([
        'ds-pagination__items',
        hide && 'ds-pagination__items--hide',
    ]);

    const handlePreviousClick = () => {
        handlePrev?.();

        if(selectedPage === 1) {
            setSelectedPage(1);
            return;
        }
        setSelectedPage(selectedPage - 1);
    }

    const handleNextClick = () => {
        handleNext?.();
        const nextPage = selectedPage + 1;

        if(nextPage === total + 1) {
            setSelectedPage(1);
            return;
        }
        setSelectedPage(nextPage);
    }

    useEffect(() => {
        if(notInitialRender.current) {
            handleNew?.(selectedPage);
            return;
        }
        notInitialRender.current = true;
    }, [selectedPage]);

    useEffect(() => {
        setSelectedPage(current);
    }, [current]);

    return (
        <nav className={classNameList} data-testid="ds-pagination">
            {!hideButtons && (
                <Button
                    type="button"
                    icon={{ icon: 'chevron-left' }}
                    context={context}
                    onClick={handlePreviousClick}
                    disabled={disabled && selectedPage === 1}
                    appearance="icon"
                    aria-label="Previous page"
                    data-testid="ds-pagination-button-prev"
                />
            )}
            <div className={paginationItemsClassNameList} data-testid="ds-pagination-items">
                {type === 'numbers' && (
                    <Numbers
                        hide={hide}
                        total={total}
                        range={range}
                        onClick={setSelectedPage}
                        context={context}
                        selected={selectedPage}
                    />
                )}
                { type === 'dots' && (
                    <Dots
                        hide={hide}
                        total={total}
                        limit={limitDots}
                        context={context}
                        selected={selectedPage}

                    />
                )}
            </div>
            {!hideButtons && (
                <Button
                    type="button"
                    icon={{ icon: 'chevron-right' }}
                    context={context}
                    onClick={handleNextClick}
                    disabled={disabled && selectedPage === total}
                    appearance="icon"
                    aria-label="Next page"
                    data-testid="ds-pagination-button-next"
                />
            )}
        </nav>
    );
};
