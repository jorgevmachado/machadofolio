import React, { useEffect, useRef } from 'react';

import { joinClass, type TColors, type TContext } from '../../utils';

import { Icon, Text } from '../../elements';

import './Modal.scss';

interface ModalProps extends  React.HTMLAttributes<HTMLDivElement>  {
    title?: string;
    isOpen: boolean;
    width?: string;
    context?: TContext;
    onClose(): void;
    children: React.ReactNode;
    maxHeight?: string;
    closeOnEsc?: boolean;
    backDropColor?: TColors;
    customCloseIcon?: React.ReactElement;
    closeOnOutsideClick?: boolean;
    removeBackgroundScroll?: boolean;
}

export default function Modal({
                                  title,
                                  width = '500px',
                                  isOpen,
                                  context = 'primary',
                                  onClose,
                                  children,
                                  maxHeight = '80vh',
                                  closeOnEsc = true,
                                  backDropColor = 'neutral-100',
                                  customCloseIcon,
                                  closeOnOutsideClick = true,
                                  removeBackgroundScroll = true,
                                  ...props
                              }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            previouslyFocusedElement.current = document.activeElement as HTMLElement;
            modalRef.current?.focus();
        } else {
            previouslyFocusedElement.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (removeBackgroundScroll && isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            if (removeBackgroundScroll) {
                document.body.style.overflow = 'auto';
            }
        };
    }, [isOpen, removeBackgroundScroll]);

    useEffect(() => {
        if (!isOpen){
            return;
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (closeOnEsc && e.key === 'Escape') {
                onClose();
            }
            if (e.key === 'Tab' && modalRef.current) {
                const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const first = focusableEls[0];
                const last = focusableEls[focusableEls.length - 1];
                if (!e.shiftKey && document.activeElement === last && first) {
                    e.preventDefault();
                    first.focus();
                }
                if (e.shiftKey && document.activeElement === first && last) {
                    e.preventDefault();
                    last.focus();
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeOnEsc, onClose]);

    const classNameListBackdrop = joinClass([
        'ds-modal__backdrop',
        `ds-background-color-${backDropColor}`
    ]);

    const classNameList = joinClass([
        'ds-modal__content',
        'ds-modal__fade-in',
        `ds-modal__context--${context}`,
    ]);

    return isOpen ? (
        <>
            <div
                onClick={() => closeOnOutsideClick && onClose()}
                className={classNameListBackdrop}
                data-testid="ds-modal-backdrop"
                aria-hidden="true"
            />
            <div
                {...props}
                ref={modalRef}
                role="dialog"
                tabIndex={-1}
                style={{ width, maxHeight }}
                className={classNameList}
                data-testid="ds-modal"
                aria-modal="true"
                aria-labelledby="ds-modal-title"
                aria-describedby="ds-modal-description"
            >
                <div className="ds-modal__header" data-testid="ds-modal-header">
                    {title && (
                        <Text
                            id="ds-modal-title"
                            tag="h2"
                            weight="bold"
                            variant="xlarge"
                            className="ds-modal__title"
                        >
                            {title}
                        </Text>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="ds-modal__close"
                        aria-label="Close modal"
                        tabIndex={0}
                        data-testid="ds-modal-close"
                    >
                        {customCloseIcon || <Icon icon="close" size={24} />}
                    </button>
                </div>
                <div id="ds-modal-description" data-testid="ds-modal-children">
                    {children}
                </div>
            </div>
        </>
    ) : null;
};
