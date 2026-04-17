import React from 'react';

import i18next, { TFunction } from 'i18next';

import type { SupportedLang, TI18nBrands } from './types';

export type TranslatorFunction = TFunction;

export type I18nContextProps = {
    t: TFunction;
    lang: string;
    brand: TI18nBrands;
    setLanguage: (lang: string) => void;
    availableLanguages: Array<SupportedLang>;
}

export default React.createContext<I18nContextProps>({
    t: i18next.t.bind(i18next),
    lang: 'en',
    brand: 'default',
    setLanguage: () => {},
    availableLanguages: [],
});