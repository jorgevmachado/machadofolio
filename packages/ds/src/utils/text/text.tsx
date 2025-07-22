import React from 'react';

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
        console.warn('Invalid children type. Expected string or ReactNode.');
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

function generateComponentId(text: string): string {
    const uuid = (currentDate: Date = new Date()) => {
        let date = currentDate.getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const random = (date + Math.random() + 16) % 16 | 0;
            date = Math.floor(date / 16);
            return (c == 'x' ? random : (random & 0x3) | 0x8).toString(16);
        });
    };
    const uuidGenerate = uuid();
    const random = (Math.random() * 10).toFixed(1);
    return `${text}-${random}-${uuidGenerate}`;
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