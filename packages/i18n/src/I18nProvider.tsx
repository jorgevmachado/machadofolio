import React, { useEffect, useState } from 'react';
import i18next, { TFunction } from 'i18next';

import resources from './resources.json' with { type: "json" };

import I18nContext from './I18nContext';

export interface I18nResources {
    [lng: string]: {
        translation: Record<string, string>;
    };
}

type I18nProviderProps = {
    children: React.ReactNode;
    defaultLang?: string;
}

export default function I18nProvider({ children, defaultLang = 'en' }: I18nProviderProps) {
    const [lang, setLang] = useState<string>(defaultLang);
    const [initialized, setInitialized] = useState<boolean>(false);

    const [t, setT] = useState<TFunction>(() => i18next.t.bind(i18next));

    useEffect(() => {
        if(!initialized) {
            i18next.init({
                lng: lang,
                resources: resources as I18nResources,
                fallbackLng: 'en',
                interpolation: { escapeValue: false },
            }).then(() => {
                setT(() => i18next.t.bind(i18next));
            });
            setInitialized(true);
        } else {
            i18next.changeLanguage(lang).then(() => {
                setT(() => i18next.t.bind(i18next));
            });
        }
    }, [lang]);

    const setLanguage = (lng: string) => {
        setLang(lng);
    };

    return (
        <I18nContext.Provider value={{ lang, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    )
}