import React, { useContext, useMemo } from 'react';

import { useBreakpoint } from '@repo/ds';

import { Slide } from '../../animations';

import Alert, { AlertDataProps } from './Alert';
import AlertComponent from './AlertComponent';
import { STYLE_ALERT, STYLE_DESKTOP, STYLE_MOBILE } from './styles';
import useAlertState from './useAlertState';

type AlertContextProps = {
    add: (alert: AlertDataProps) => void;
    alerts: Array<Alert>;
}

const AlertContext = React.createContext<AlertContextProps>({
    add: () => {},
    alerts: [],
});

type AlertProviderProps = {
    style?: React.CSSProperties;
    children: React.ReactNode;
}

export function AlertProvider({ style, children }: AlertProviderProps) {
    const { alerts, addAlert, removeAlert } = useAlertState();
    const { isMobile } = useBreakpoint();

    const STYLE = {
        ...STYLE_ALERT,
        ...(isMobile ? STYLE_MOBILE : STYLE_DESKTOP),
    }

    const context: AlertContextProps = useMemo(() => ({
        alerts,
        add: (alert) => addAlert(alert),
    }), [alerts, addAlert]);

    return (
        <AlertContext.Provider value={context}>
            <div style={!style ? STYLE : { ...STYLE, ...style}}>
                {alerts.map(alert => (
                        <div key={alert.id} style={{ marginBottom: 15 }}>
                            <Slide direction={isMobile ? 'top' : 'right'} enter={alert.visible}>
                                <AlertComponent
                                    alert={alert}
                                    onRemove={removeAlert}
                                />
                            </Slide>
                        </div>
                    ))}
            </div>
            {children}
        </AlertContext.Provider>
    )
}

export function useAlert() {
    const { add, alerts } = useContext(AlertContext);

    return { addAlert: add, alerts };
}