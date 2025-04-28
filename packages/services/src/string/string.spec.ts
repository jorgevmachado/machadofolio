import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {normalize} from './string';

describe('String function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
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
});