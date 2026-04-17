import React, { useEffect, useMemo, useState } from 'react';
import i18next, { TFunction } from 'i18next';

import I18nContext, { I18nContextProps } from './I18nContext';
import type { TI18nBrands } from './types';
import { AVAILABLE_LANGUAGES } from './constants';
import { buildResources } from './utils';

type I18nProviderProps = {
    brand?: TI18nBrands;
    children: React.ReactNode;
    defaultLang?: string;
}

export default function I18nProvider({ brand = 'default', children, defaultLang = 'en' }: Readonly<I18nProviderProps>) {
    const [lang, setLang] = useState<string>(defaultLang);
    const [initialized, setInitialized] = useState<boolean>(false);

    const [t, setT] = useState<TFunction>(() => i18next.t.bind(i18next));

    useEffect(() => {
        if (initialized) {
            i18next.changeLanguage(lang).then(() => {
                setT(() => i18next.t.bind(i18next));
            });
        } else {
            const resources = buildResources(brand);
            i18next.init({
                lng: lang,
                resources,
                fallbackLng: 'en',
                interpolation: { escapeValue: false },
            }).then(() => {
                setT(() => i18next.t.bind(i18next));
            });
            setInitialized(true);
        }
    }, [lang]);

    const setLanguage = (lng: string) => {
        setLang(lng);
    };

    const context = useMemo<I18nContextProps>(() => ({
        t,
        lang,
        brand,
        setLanguage,
        availableLanguages: AVAILABLE_LANGUAGES,
    }), [t, lang, brand]);

    return (
        <I18nContext.Provider value={context}>
            {children}
        </I18nContext.Provider>
    )
}