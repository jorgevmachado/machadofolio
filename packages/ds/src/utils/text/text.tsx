import React from 'react';

import { removePunctuationAndSpaces, restorePunctuationAtEnd } from '@repo/services';

import { TranslatorFunction } from '@repo/i18n';

import generateComponentId from '../generate-component-id';

type TranslateTextParams = {
    text?: string;
    name?: string;
    translator?: TranslatorFunction;
}


export function isReactNode(value: unknown): boolean {
    return (
        React.isValidElement(value) ||
        (Array.isArray(value) && value.every(isReactNode))
    );
}

export function formattedText(children: unknown) {
    if (isReactNode(children)) {
        return children;
    }
    if (typeof children !== 'string') {
        return children;
    }

    return textCleaner(children as string).map((paragraph) => formatText(paragraph))[0];
}

function textCleaner(text: string): Array<string> {
    return text.split(/(?:\r\n){2,}/g);
}

function formatText(paragraph: string) {
    const formatted = applyTextFormatting(paragraph);
    return replaceTextBetween(formatted);
}

function applyTextFormatting(text: string) {
    return text
        .split(/(_.*?_)|(\*.*?\*)|(\++?\++)/g)
        .filter((n) => n)
        .map((str) => applyFormatting(str));
}

function applyFormatting(text: string) {
    switch (text.charAt(0)) {
        case '_':
            return (
                <em key={generateComponentId(`${text}_`)}>
                    {applyTextFormatting(text.substring(1, text.length - 1))}
                </em>
            );
        case '*':
            return (
                <strong key={generateComponentId(`${text}*`)}>
                    {applyTextFormatting(text.substring(1, text.length - 1))}
                </strong>
            );
        default:
            return text === '++' ? (
                <br key={generateComponentId(`${text}br`)} />
            ) : (
                text
            );
    }
}

function replaceTextBetween(texts: Array<string | React.JSX.Element>) {
    const replaceTagsRegex = /<(.*?)>(.*?)<\/\1>/g;
    return texts.map((text, index) => {
        if (typeof text === 'string' && text.match(replaceTagsRegex)) {
            const value = text.replace(replaceTagsRegex, '$2');
            const className = text.replace(replaceTagsRegex, '$1');
            return (<span key={`${text}-${index}`} className={className}>{value}</span>
            );
        }
        return text;
    });
}

export function translateText({ text, translator, name } : TranslateTextParams) {
    if(!translator) {
        return text;
    }
    if(name) {
        const currentText = translator(name);
        return currentText !== name ? currentText : text;
    }
    if(text) {
        const punctuationMap = removePunctuationAndSpaces(text);
        const cleanText = punctuationMap.cleaned.toLowerCase();
        const translatedText = translator(cleanText);
        return translatedText !== cleanText ? restorePunctuationAtEnd(translatedText, punctuationMap.punctuations) : text;
    }
    return text;
}

export function translateValue(value: string | unknown, name?: string, translator?: TranslatorFunction, textsToTranslate?: Array<string>) {
    if(translator) {
        if(typeof value === 'string') {
            return translateText({ text: value, translator, name });
        }
        if(Array.isArray(value) && value.length > 1) {
            return value.map((v) => {
                return typeof v === 'string' ? translateText({ text: v, translator }) : v;
            });
        }
        if(Array.isArray(value) && value.length === 1) {
            const currentValue =  typeof value[0] === 'string' ? value[0] : '';
            return translateText({ text: currentValue, translator, name });
        }
        return value;
    }
    return value;
}