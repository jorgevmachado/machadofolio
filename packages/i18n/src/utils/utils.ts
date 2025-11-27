import type { I18nResources, SupportedLang, TI18nBrands } from '../types';
import { AVAILABLE_LANGUAGES, RESOURCES } from '../constants';

type MergeResourcesProps = {
    global: Record<SupportedLang, { [key: string]: string }>;
    brand?: Record<SupportedLang, { [key: string]: string }>;
    availableLanguages: Array<SupportedLang>;
}

export function mergeResources({
                                   global,
                                   brand,
                                   availableLanguages,
                               }: MergeResourcesProps): I18nResources {
    const result: I18nResources = {};
    for (const lang of availableLanguages) {
        result[lang] = {
            translation: {
                ...global[lang],
                ...(brand ? brand[lang] : {}),
            }
        }
    }
    return result;
}


export function buildResources(brand: TI18nBrands): I18nResources  {
    switch (brand) {
        case 'geek':
            return mergeResources({ global: RESOURCES.global, brand: RESOURCES.geek, availableLanguages: AVAILABLE_LANGUAGES });
        case 'law':
            return mergeResources({ global: RESOURCES.global, brand: RESOURCES.law, availableLanguages: AVAILABLE_LANGUAGES });
        case 'auth':
            return mergeResources({ global: RESOURCES.global, brand: RESOURCES.auth, availableLanguages: AVAILABLE_LANGUAGES });
        case 'finance':
            return mergeResources({ global: RESOURCES.global, brand: RESOURCES.finance, availableLanguages: AVAILABLE_LANGUAGES });
        default:
            return mergeResources({ global: RESOURCES.global, availableLanguages: AVAILABLE_LANGUAGES });
    }
}