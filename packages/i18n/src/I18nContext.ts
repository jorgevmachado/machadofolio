import React from 'react';
import i18next, { TFunction } from 'i18next';

export type TranslatorFunction = TFunction;

export type TI18nBrands = 'finance' | 'law' | 'geek' | 'auth' | 'default';

export type I18nContextProps = {
    t: TFunction;
    lang: string;
    brand: TI18nBrands;
    setLanguage: (lang: string) => void;
}

export default React.createContext<I18nContextProps>({
    t: i18next.t.bind(i18next),
    lang: 'en',
    brand: 'default',
    setLanguage: () => {}
});