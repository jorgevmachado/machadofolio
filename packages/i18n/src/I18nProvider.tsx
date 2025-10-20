import React, { useEffect, useState } from 'react';
import i18next, { TFunction } from 'i18next';

import globalResourceEn from './locales/globals/en.json' with { type: "json" };
import globalResourcePtBR from './locales/globals/pt.json' with { type: "json" };

import authResourceEn from './locales/brands/auth/en.json' with { type: "json" };
import authResourcePtBR from './locales/brands/auth/pt.json' with { type: "json" };

import geekResourceEn from './locales/brands/geek/en.json' with { type: "json" };
import geekResourcePtBR from './locales/brands/geek/pt.json' with { type: "json" };

import lawResourceEn from './locales/brands/law/en.json' with { type: "json" };
import lawResourcePtBR from './locales/brands/law/pt.json' with { type: "json" };

import financeResourceEn from './locales/brands/finance/en.json' with { type: "json" };
import financeResourcePtBR from './locales/brands/finance/pt.json' with { type: "json" };

import I18nContext, { type TI18nBrands } from './I18nContext';

export interface I18nResources {
    [lng: string]: {
        translation: Record<string, string>;
    };
}

type I18nProviderProps = {
    brand?: TI18nBrands;
    children: React.ReactNode;
    defaultLang?: string;
}

type SupportedLang = 'en' | 'pt-BR';

type TResources = {
    law: Record<SupportedLang, typeof lawResourceEn>;
    auth: Record<SupportedLang, typeof authResourceEn>;
    geek: Record<SupportedLang, typeof geekResourceEn>;
    global: Record<SupportedLang, typeof globalResourceEn>;
    finance: Record<SupportedLang, typeof financeResourceEn>;
}

const AVAILABLE_LANGUAGES: Array<SupportedLang> = ['en', 'pt-BR'];



const RESOURCES: TResources = {
    law: {
        en: lawResourceEn,
        'pt-BR': lawResourcePtBR
    },
    auth: {
        en: authResourceEn,
        'pt-BR': authResourcePtBR
    },
    geek: {
        en: geekResourceEn,
        'pt-BR': geekResourcePtBR
    },
    global: {
        en: globalResourceEn,
        'pt-BR': globalResourcePtBR,
    },
    finance: {
        en: financeResourceEn,
        'pt-BR': financeResourcePtBR,
    }
}

export default function I18nProvider({ brand = 'default', children, defaultLang = 'en' }: I18nProviderProps) {
    const [lang, setLang] = useState<string>(defaultLang);
    const [initialized, setInitialized] = useState<boolean>(false);

    const [t, setT] = useState<TFunction>(() => i18next.t.bind(i18next));

    const mergeResources = (
      globalResource: Record<SupportedLang, { [key: string]: string }>,
      brandResource: Record<SupportedLang, { [key: string]: string }>
    ): I18nResources => {
      const result: I18nResources = {};
      for (const lang of AVAILABLE_LANGUAGES) {
        result[lang] = {
          translation: {
            ...globalResource[lang],
            ...brandResource[lang],
          },
        };
      }
      return result;
    }

    const buildResources = (brand: TI18nBrands): I18nResources => {
      switch (brand) {
        case 'geek':
          return mergeResources(RESOURCES.global, RESOURCES.geek);
        case 'law':
          return mergeResources(RESOURCES.global, RESOURCES.law);
        case 'auth':
          return mergeResources(RESOURCES.global, RESOURCES.auth);
        case 'finance':
          return mergeResources(RESOURCES.global, RESOURCES.finance);
        default:
          return mergeResources(RESOURCES.global, RESOURCES.global);
      }
    }

    useEffect(() => {
        if(!initialized) {
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
        <I18nContext.Provider value={{ lang, brand, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    )
}