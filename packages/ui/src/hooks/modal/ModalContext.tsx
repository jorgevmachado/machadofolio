import React, { useState } from 'react';

import { Modal } from '@repo/ds';

type ModalProps = React.ComponentProps<typeof Modal>;

type ModalContextProps = Omit<ModalProps, 'isOpen' | 'onClose' | 'children'> & {
    body: React.ReactNode;
}

export function useModal() {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [config, setConfig] = useState<ModalContextProps | undefined>(undefined);

    const open = (config: ModalContextProps) => {
        setConfig(config);
        setIsVisible(true);
    }

    const close = () => {
        setIsVisible(false);
        setConfig(undefined);
    }

    const modal = isVisible && config
        ? (
            <Modal {...config} isOpen={isVisible} onClose={close}>
                {config.body}
            </Modal>
        )
        : null;

    return {
        modal,
        openModal: open,
        closeModal: close,
    }
}