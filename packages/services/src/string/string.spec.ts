import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';


import {
    capitalize,
    cleanFormatter,
    cleanTextByListText,
    convertSubPathUrl, convertToPercent,
    extractLastItemFromUrl,
    findRepeated,
    formatPath,
    formatUrl, getPercentValue,
    initials,
    matchesRepeatWords,
    normalize,
    removePunctuationAndSpaces,
    replaceWords,
    type ReplaceWordsParam,
    restorePunctuationAtEnd,
    sanitize,
    separateCamelCase,
    snakeCaseToNormal,
    toCamelCase,
    toSnakeCase,
    truncateString,
    validatePath,
    validateText
} from './string';

jest.mock('uuid');


describe('String function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });


    describe('initials', () => {
        it('should return initials ignoring stop-words.', () => {
            expect(initials('Maria Clara de Souza', 3)).toBe('MCS');
            expect(initials('João da Silva', 2)).toBe('JS');
            expect(initials('Ana dos Santos', 2)).toBe('AS');
        });

        it('should return complete when initialsLength <= 0.', () => {
            expect(initials('joão da silva', 0)).toBe('João da silva');
        });

        it('should work with empty strings and return empty.', () => {
            expect(initials('', 3)).toBe('');
            expect(initials('   ', 2)).toBe('');
        });

        it('should allow customization of stop-words.', () => {
            expect(initials('João da Silva Junior', 3, ['junior'])).toBe('JDS');
            expect(initials('Pedro de Alcântara', 2, ['de', 'alcântara'])).toBe('P');
        });

        it('should calculate initials even with multiple extra spaces.', () => {
            expect(initials('  João   da   Silva   ', 2)).toBe('JS');
            expect(initials(' Pedro    de   Moraes', 2)).toBe('PM');
        });
    });

    describe('formatUrl', () => {
        const url = 'http://localhost:3000';
        it('should return formatted url when received url, path and params', () => {
            expect(formatUrl(url, 'user', { name: 'your_name' })).toEqual(
                'http://localhost:3000/user?name=your_name',
            );
        });

        it('should return formatted url when do not received params', () => {
            expect(formatUrl(url, 'user')).toEqual('http://localhost:3000/user');
        });
    });

    describe('normalize', () => {
        it('should remove accents from a string', () => {
            expect(normalize('João')).toBe('Joao');
            expect(normalize('çaêü')).toBe('caeu');
        });

        it('must remove extra spaces at the beginning and end', () => {
            expect(normalize('  João Silva  ')).toBe('Joao Silva');
        });

        it('deve normalizar múltiplos espaços entre palavras para um único espaço', () => {
            expect(normalize('João    da    Silva')).toBe('Joao da Silva');
        });

        it('should normalize multiple spaces between words to a single space', () => {
            expect(normalize('Joao da Silva')).toBe('Joao da Silva');
        });

        it('should return empty string if input is empty.', () => {
            expect(normalize('')).toBe('');
        });
    });

    describe('formatPath', () => {
        it('should return parentPath + childPath when there is NO grandParentPath.', () => {
            const result = formatPath({
                childPath: 'child',
                parentPath: 'parent',
            });
            expect(result).toBe('/parent/child');
        });

        it('should return grandParentPath + parentPath + childPath when grandParentPath exists.', () => {
            const result = formatPath({
                childPath: '/child',
                parentPath: 'parent',
                grandParentPath: 'grandparent',
            });
            expect(result).toBe('/grandparent/parent/child');
        });

        it('should work when paths already have "/".', () => {
            const result = formatPath({
                childPath: '/c',
                parentPath: '/p',
                grandParentPath: '/gp',
            });
            expect(result).toBe('/gp/p/c');
        });

        it('should work correctly if grandParentPath is empty string, behaving like "no grandParent".', () => {
            const result = formatPath({
                childPath: 'filho',
                parentPath: 'pai',
                grandParentPath: '',
            });
            expect(result).toBe('/pai/filho');
        });

        it('should work if paths are empty strings.', () => {
            const result = formatPath({ childPath: '', parentPath: '', grandParentPath: '' });
            expect(result).toBe('//');
        });
    });

    describe('capitalize', () => {
        it('Must capitalize the first letter of the string', () => {
            expect(capitalize('hello')).toEqual('Hello');
        });
    });

    describe('toSnakeCase', () => {
        it('Must convert a string to snake case', () => {
            expect(toSnakeCase('snakeCase')).toEqual('snake_case');
        });

        it('Must convert a string normalize to snake case', () => {
            expect(toSnakeCase('Snake Case')).toEqual('snake_case');
        });

        it('Must return value when not match', () => {
            expect(toSnakeCase('______')).toEqual('______');
        });

        it('Must return a string empty when value is undefined', () => {
            expect(toSnakeCase(undefined)).toEqual('');
        });
    });

    describe('toCamelCase', () => {
        it('Must convert a string to camel case', () => {
            expect(toCamelCase('camel_case')).toEqual('camelCase');
        });

        it('Must return a string empty when value is undefined', () => {
            expect(toCamelCase(undefined)).toEqual('');
        });
    });

    describe('findRepeated', () => {
        const firstObject = {
            id: '10738468f-3285-4e89-9687-0a6463731374',
            name: 'first',
        };
        const listObjectId = [
            firstObject,
            { id: '698e7b69-077a-4a34-8abd-e4cc556e2afe', name: 'second' },
            { id: '442d3d56-de9c-402a-8230-bee52fbe85dc', name: 'third' },
        ];
        it('should return undefined because it does not have a repeated id', () => {
            expect(findRepeated(listObjectId, 'id')).toBeUndefined();
        });

        it('should return undefined because it does not have a repeated name', () => {
            expect(findRepeated(listObjectId, 'name')).toBeUndefined();
        });

        it('should return id because it have a repeated id', () => {
            expect(findRepeated([...listObjectId, firstObject], 'id')).toEqual(
                firstObject.id,
            );
        });

        it('should return name because it have a repeated name', () => {
            expect(findRepeated([...listObjectId, firstObject], 'name')).toEqual(
                firstObject.name,
            );
        });
    });

    describe('validatePath', () => {
        it('Should validate path when path start with /', () => {
            expect(validatePath('/path')).toEqual('/path');
        });

        it('Should validate path when path not start with /', () => {
            expect(validatePath('path')).toEqual('/path');
        });
    });

    describe('truncateString', () => {
        it('should truncate the string to the first 3 uppercase characters.', () => {
            expect(truncateString('Janeiro', 3)).toBe('JAN');
        });

        it('should return the string in all uppercase if the length is greater than the size of the string.', () => {
            expect(truncateString('Junho', 10)).toBe('JUNHO');
        });

        it('should return the string for the first 3 characters in uppercase and normalized without accent.', () => {
            expect(truncateString('Março', 4)).toBe('MARC');
        });

        it('should return the string for the first 3 characters in uppercase with accent.', () => {
            expect(truncateString('Março', 4, false)).toBe('MARÇ');
        });

        it('should return empty if the string is empty.', () => {
            expect(truncateString('', 5)).toBe('');
        });

        it('should return empty if length is 0.', () => {
            expect(truncateString('Julho', 0)).toBe('');
        });

        it('should work correctly with strings shorter than the length.', () => {
            expect(truncateString('Maio', 10)).toBe('MAIO');
        });
    });

    describe('convertSubPathUrl', () => {
        const by = 'by';
        const pathUrl = 'path_url';
        const subPathUrl = 'sub_path_url';
        const conectorPath = 'conector_path';
        it('should convert path without subPathUrl', () => {
            expect(convertSubPathUrl({ pathUrl })).toEqual(pathUrl);
        });

        it('should convert path without subPathUrl with conectorPath and isParam true', () => {
            expect(
                convertSubPathUrl({ pathUrl, conectorPath, isParam: true }),
            ).toEqual(`${pathUrl}/${conectorPath}`);
        });

        it('should convert path with subPathUrl', () => {
            expect(convertSubPathUrl({ pathUrl, subPathUrl })).toEqual(
                `${pathUrl}/${subPathUrl}`,
            );
        });

        it('should convert path with conectorPath', () => {
            expect(convertSubPathUrl({ pathUrl, subPathUrl, conectorPath })).toEqual(
                `${pathUrl}/${conectorPath}/${subPathUrl}`,
            );
        });

        it('should convert path with by without subPathUrl', () => {
            expect(convertSubPathUrl({ by, pathUrl })).toEqual(`${pathUrl}/${by}`);
        });

        it('should convert path with by without subPathUrl with conectorPath and isParam true', () => {
            expect(
                convertSubPathUrl({ by, pathUrl, conectorPath, isParam: true }),
            ).toEqual(`${pathUrl}/${by}/${conectorPath}`);
        });

        it('should convert path with by with subPathUrl', () => {
            expect(convertSubPathUrl({ by, pathUrl, subPathUrl })).toEqual(
                `${pathUrl}/${by}/${subPathUrl}`,
            );
        });

        it('should convert path with by with conectorPath', () => {
            expect(convertSubPathUrl({ by, pathUrl, subPathUrl, conectorPath })).toEqual(
                `${pathUrl}/${by}/${conectorPath}/${subPathUrl}`,
            );
        });
    });

    describe('separateCamelCase', () => {
        it('Must separate camel case string', () => {
            expect(separateCamelCase('helloWorld')).toEqual('hello World');
        });
    });

    describe('snakeCaseToCamelCase', () => {
        it('deve converter uma string SNAKE_CASE para formato normal', () => {
            expect(snakeCaseToNormal('BANK_SLIP')).toBe('Bank Slip');
            expect(snakeCaseToNormal('USER_ACCOUNT_DETAILS')).toBe(
                'User Account Details',
            );
            expect(snakeCaseToNormal('PAYMENT_STATUS')).toBe('Payment Status');
        });

        it('deve lidar com strings de uma palavra sem underscore', () => {
            expect(snakeCaseToNormal('BANK')).toBe('Bank');
            expect(snakeCaseToNormal('BANKING')).toBe('Banking');
        });

        it('deve retornar uma string vazia se o valor for vazio', () => {
            expect(snakeCaseToNormal('')).toBe('');
        });

        it('deve lidar com entradas lowercase (snake_case)', () => {
            expect(snakeCaseToNormal('bank_slip')).toBe('Bank Slip');
            expect(snakeCaseToNormal('user_account_details')).toBe(
                'User Account Details',
            );
            expect(snakeCaseToNormal('payment_status')).toBe('Payment Status');
        });

        it('deve ignorar múltiplos underscores consecutivos corretamente', () => {
            expect(snakeCaseToNormal('BANK__SLIP')).toBe('Bank  Slip');
            expect(snakeCaseToNormal('USER___ACCOUNT___DETAILS')).toBe(
                'User   Account   Details',
            );
        });

        it('deve lidar com espaços antes e após a entrada', () => {
            expect(snakeCaseToNormal(' BANK_SLIP ')).toBe('Bank Slip');
            expect(snakeCaseToNormal('  USER_ACCOUNT_DETAILS  ')).toBe(
                'User Account Details',
            );
        });

        it('não deve alterar strings sem underscores que já estão formatadas', () => {
            expect(snakeCaseToNormal('Bank Slip')).toBe('Bank Slip');
            expect(snakeCaseToNormal('User Account')).toBe('User Account');
        });
    });

    describe('extractLastItemFromUrl', () => {
        it('Must separate item from url', () => {
            expect(
                extractLastItemFromUrl(
                    'http://localhost:9000/external/api/v2/ability/65/',
                ),
            ).toEqual('65');
        });

        it('Must return default url when dont have /', () => {
            expect(extractLastItemFromUrl('ability')).toEqual('ability');
        });

        it('Must return empty string if url is undefined', () => {
            expect(extractLastItemFromUrl()).toEqual('');
        });

        it('Must return empty string if url has error and not extract last item from url', () => {
            expect(extractLastItemFromUrl('/')).toEqual('');
        });
    });

    describe('cleanFormatter', () => {
        it('should return a clean string when the string is received like cpf', () => {
            expect(cleanFormatter('000.000.000-00')).toBe('00000000000');
        });

        it('should return a clean string when the string is received like phone mobile', () => {
            expect(cleanFormatter('(00) 00000-0000')).toBe('00000000000');
        });

        it('should return a empty string when the string is received is not valid', () => {
            expect(cleanFormatter(undefined)).toBe('');
        });
    });

    describe('sanitizeFormatter', () => {
        it('should return a sanitized string when the string is received', () => {
            expect(sanitize('boyS')).toBe('boy');
        });
    });

    describe('cleanTextByListText', () => {
        it('must remove all exact terms from the list in the text', () => {
            expect(cleanTextByListText(['Study', 'Meeting'], 'Technology Study Group Meeting')).toBe('Technology Group');
        });

        it('does not change when no term is present', () => {
            expect(cleanTextByListText(['Financial'], 'User registration')).toBe('User registration');
        });

        it('removes case sensitive.', () => {
            expect(cleanTextByListText(['ADMIN', 'Beta'], 'user admin BETA extra')).toBe('user extra');
        });

        it('remove larger compound words first.', () => {
            expect(cleanTextByListText(['the Cultural', 'Center'], 'Event at the Cultural Center')).toBe('Event at');
        });

        it('removes only whole words.', () => {
            expect(cleanTextByListText(['ana'], 'focus ana Ana ANA aNA')).toBe('focus');
        });

        it('clean extra spaces after removal.', () => {
            expect(cleanTextByListText(['foo', 'bar'], ' foo  bar baz   ')).toBe('baz');
        });

        it('returns empty string if delete all.', () => {
            expect(cleanTextByListText(['foo', 'bar'], 'foo bar')).toBe('');
        });

        it('works with empty list.', () => {
            expect(cleanTextByListText([], 'any text')).toBe('any text');
        });

        it('works with empty text.', () => {
            expect(cleanTextByListText(['something'], '')).toBe('');
        });
    });

    describe('replaceWords', () => {
        it('must replace a simple word.', () => {
            const rules: ReplaceWordsParam = [{ before: 'foo', after: 'bar' }];
            expect(replaceWords('foo baz', rules)).toBe('bar baz');
        });

        it('must replace multiple occurrences.', () => {
            const rules: ReplaceWordsParam = [{ before: 'a', after: 'b' }];
            expect(replaceWords('a a a', rules)).toBe('b b b');
        });

        it('must replace several different words.', () => {
            const rules: ReplaceWordsParam = [
                { before: 'foo', after: 'bar' },
                { before: 'baz', after: 'qux' },
            ];
            expect(replaceWords('foo and baz', rules)).toBe('bar and qux');
        });

        it('must handle special characters in the before.', () => {
            const rules: ReplaceWordsParam = [{ before: 'a+b', after: 'c' }];
            expect(replaceWords('a+b a+b', rules)).toBe('c c');
        });

        it('should return the original string if there are no rules.', () => {
            expect(replaceWords('abc', [])).toBe('abc');
        });

        it('should work with empty string.', () => {
            const rules: ReplaceWordsParam = [{ before: 'foo', after: 'bar' }];
            expect(replaceWords('', rules)).toBe('');
        });

        it('should replace correctly when after is empty string.', () => {
            const rules: ReplaceWordsParam = [{ before: 'foo', after: '' }];
            expect(replaceWords('foo bar foo', rules)).toBe(' bar ');
        });

        it('must be case sensitive.', () => {
            const rules: ReplaceWordsParam = [{ before: 'Foo', after: 'Bar' }];
            expect(replaceWords('foo Foo', rules)).toBe('foo Bar');
        });

        it('should replace correctly when received words Pao de Acucar', () => {
            const rules: ReplaceWordsParam = [{ before: 'Pao de Acucar', after: 'Pão de Açúcar' }];
            expect(replaceWords('Pao de Acucar', rules)).toBe('Pão de Açúcar');
        });
    });

    describe('validateText', () => {
        it('should return the original string if it is valid.', () => {
            const result = validateText('text');
            expect(result).toEqual('text');
        });

        it('should return default fallback when dont received value.', () => {
            const result = validateText(undefined);
            expect(result).toEqual('');
        });

        it('should return custom fallback when received value empty.', () => {
            const result = validateText(' ', 'fallback');
            expect(result).toEqual('fallback');
        });
    });

    describe('matchesRepeatWords', () => {
        const DEFAULT_REPEAT_WORDS = [
            'Pagamento recebido',
            'Estorno de *'
        ];
        it('Should return true when text contains any of the patterns', () => {
            expect(matchesRepeatWords('Pagamento recebido', DEFAULT_REPEAT_WORDS)).toBeTruthy();
            expect(matchesRepeatWords('Estorno de Petz', DEFAULT_REPEAT_WORDS)).toBeTruthy();
            expect(matchesRepeatWords('Estorno de Venda', DEFAULT_REPEAT_WORDS)).toBeTruthy();
            expect(matchesRepeatWords('Other', DEFAULT_REPEAT_WORDS)).toBeFalsy();
        });

        it('Should return true when text contains any of the patterns with custom list', () => {
            const customListRepeatWords = [
                'Refunded *',
                'House'
            ]
            expect(matchesRepeatWords('Refunded House', customListRepeatWords)).toBeTruthy();
            expect(matchesRepeatWords('house', customListRepeatWords)).toBeFalsy();
            expect(matchesRepeatWords('House', customListRepeatWords)).toBeTruthy();
            expect(matchesRepeatWords('Home', customListRepeatWords)).toBeFalsy();
        });
    });

    describe('removePunctuationAndSpaces', () => {
        it('Should remove all punctuation and spaces from a string', () => {
            const text = 'Welcome, ';
            const result = removePunctuationAndSpaces(text);
            expect(result.cleaned).toEqual('Welcome');
            expect(result.punctuations).toEqual([', ']);
        });

        it('Should retorn string when dont have punctuation.', () => {
            const text = 'Welcome,';
            const result = removePunctuationAndSpaces(text);
            expect(result.cleaned).toEqual('Welcome');
            expect(result.punctuations).toEqual([',']);
        })
    });

    describe('restorePunctuationAtEnd', () => {
        it('should restore punctuation at the end of the string', () => {
            const text = 'Welcome';
            const result = restorePunctuationAtEnd(text, [', ']);
            expect(result).toEqual('Welcome, ');
        });
    });

    describe('convertToPercent', () => {

        it('should convert a decimal number to a percentage string', () => {
            expect(convertToPercent(0.75)).toBe('75%');
        });

        it('should return the default fallback string when the value is undefined', () => {
            expect(convertToPercent(undefined)).toBe('0%');
        });

        it('should return the fallback string when the value is undefined', () => {
            expect(convertToPercent(undefined, '25%')).toBe('25%');
        });
    });

    describe('getPercentValue', () => {
        it('should return the percentage string for given value and total', () => {
            expect(getPercentValue(50, 100)).toBe('50%');
        });

        it('should return 0% when total is zero to avoid division by zero', () => {
            expect(getPercentValue(100, 0)).toBe('0%');
        });
    });
});