import type { TFunction } from 'i18next';

import {
    AUTH_SUPPORTED_LANGUAGE_EN,
    FINANCE_SUPPORTED_LANGUAGE_EN,
    GEEK_SUPPORTED_LANGUAGE_EN,
    GLOBAL_SUPPORTED_LANGUAGE_EN,
    LAW_SUPPORTED_LANGUAGE_EN
} from './constants';

export type SupportedLang = 'en' | 'pt-BR';

export type TI18nBrands = 'finance' | 'law' | 'geek' | 'auth' | 'default';

export type I18nResources = {
    [lng: string]: {
        translation: Record<string, string>;
    };
}

export type TResources = {
    law: Record<SupportedLang, typeof LAW_SUPPORTED_LANGUAGE_EN>;
    auth: Record<SupportedLang, typeof AUTH_SUPPORTED_LANGUAGE_EN>;
    geek: Record<SupportedLang, typeof GEEK_SUPPORTED_LANGUAGE_EN>;
    global: Record<SupportedLang, typeof GLOBAL_SUPPORTED_LANGUAGE_EN>;
    finance: Record<SupportedLang, typeof FINANCE_SUPPORTED_LANGUAGE_EN>;
}

export type I18nTFunction = TFunction;