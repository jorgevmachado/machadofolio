import React from 'react';
import i18next, { TFunction } from 'i18next';

export type I18nContextProps = {
    t: TFunction;
    lang: string;
    setLanguage: (lang: string) => void;
}

export default React.createContext<I18nContextProps>({
    t: i18next.t.bind(i18next),
    lang: 'en',
    setLanguage: () => {}
});