import React, { useEffect, useState } from 'react';

import './Internationalization.scss';

export type LanguageOption = {
    flag: string;
    code: string;
    label: string;
}

export type InternationalizationProps = {
    lang?: string;
    onChange?: (languageOption: LanguageOption) => void;
    languageOptions?: Array<LanguageOption>;
    currentLanguageOptions?: (languageOptions: Array<LanguageOption>) => void;
};

const LANGUAGES_DEFAULT: Array<LanguageOption> = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export default function Internationalization({ lang = 'en', onChange, languageOptions = LANGUAGES_DEFAULT, currentLanguageOptions }: InternationalizationProps) {
    const [language, setLanguage] = useState<string>(lang);
    const [languages, setLanguages] = useState<Array<LanguageOption>>(languageOptions);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const currentLang = languages.find(l => l.code === language) || languages[0];

    const handleLangSelect = (code: string) => {
        setLanguage(code);
        const languageOption = languages.find(l => l.code === code);
        if(onChange && languageOption) {
            onChange(languageOption);
        }
        setDropdownOpen(false);
    };

    useEffect(() => {
        setLanguage(lang);
    }, [lang]);

    useEffect(() => {
        setLanguages(languageOptions)
    }, [languageOptions]);

    useEffect(() => {
        if(currentLanguageOptions) {
            currentLanguageOptions(languages);
        }
    }, [currentLanguageOptions]);
    return (
        <div className="ui-internationalization__wrapper">
            <button
                type="button"
                className="ui-internationalization__activator"
                aria-label="Select language"
                onClick={() => setDropdownOpen((open) => !open)}
            >
                <span className="ui-internationalization__activator--flag">{currentLang?.flag}</span>
            </button>
            {dropdownOpen && (
                <div className="ui-internationalization__dropdown">
                    {languages.filter(lang => lang.code !== currentLang?.code).map(lang => (
                        <button
                            key={lang.code}
                            className="ui-internationalization__dropdown--option"
                            onClick={() => handleLangSelect(lang.code)}
                            aria-label={lang.label}
                            tabIndex={0}
                            onMouseDown={e => e.preventDefault()}
                        >
                            <span className="ui-internationalization__dropdown--option-flag">{lang.flag}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}