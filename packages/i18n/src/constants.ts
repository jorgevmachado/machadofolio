import type { SupportedLang, TResources } from './types';

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

export const AVAILABLE_LANGUAGES: Array<SupportedLang> = ['en', 'pt-BR'];

export const GLOBAL_SUPPORTED_LANGUAGE_EN = globalResourceEn;
export const GLOBAL_SUPPORTED_LANGUAGE_PT_BR = globalResourcePtBR;

export const AUTH_SUPPORTED_LANGUAGE_EN = authResourceEn;
export const AUTH_SUPPORTED_LANGUAGE_PT_BR = authResourcePtBR;

export const GEEK_SUPPORTED_LANGUAGE_EN = geekResourceEn;
export const GEEK_SUPPORTED_LANGUAGE_PT_BR = geekResourcePtBR;

export const LAW_SUPPORTED_LANGUAGE_EN = lawResourceEn;
export const LAW_SUPPORTED_LANGUAGE_PT_BR = lawResourcePtBR;

export const FINANCE_SUPPORTED_LANGUAGE_EN = financeResourceEn;
export const FINANCE_SUPPORTED_LANGUAGE_PT_BR = financeResourcePtBR;


export const RESOURCES: TResources = {
    law: {
        en: LAW_SUPPORTED_LANGUAGE_EN,
        'pt-BR': LAW_SUPPORTED_LANGUAGE_PT_BR
    },
    auth: {
        en: AUTH_SUPPORTED_LANGUAGE_EN,
        'pt-BR': AUTH_SUPPORTED_LANGUAGE_PT_BR
    },
    geek: {
        en: GEEK_SUPPORTED_LANGUAGE_EN,
        'pt-BR': GEEK_SUPPORTED_LANGUAGE_PT_BR
    },
    global: {
        en: GLOBAL_SUPPORTED_LANGUAGE_EN,
        'pt-BR': GLOBAL_SUPPORTED_LANGUAGE_PT_BR,
    },
    finance: {
        en: FINANCE_SUPPORTED_LANGUAGE_EN,
        'pt-BR': FINANCE_SUPPORTED_LANGUAGE_PT_BR,
    }
}