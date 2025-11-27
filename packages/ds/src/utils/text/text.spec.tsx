import React from 'react';

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

const mockRestorePunctuationAtEnd = jest.fn();
const mockRemovePunctuationAndSpaces = jest.fn();
jest.mock('@repo/services', () => {
    const originalModule = jest.requireActual('@repo/services') as Record<string, any>;
    return {
        ...originalModule,
        restorePunctuationAtEnd: mockRestorePunctuationAtEnd,
        removePunctuationAndSpaces: mockRemovePunctuationAndSpaces,
    }
});

import { TranslatorFunction } from '@repo/i18n';

import * as Text from './text';

describe('text utilities', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('isReactNode', () => {
        it("should return true for ReactElement", () => {
            expect(Text.isReactNode(<div />)).toBe(true);
        });
        it("should return true for an array of ReactElements", () => {
            expect(Text.isReactNode([<div key="div" />, <span key="span" />])).toBe(true);
        });
        it("should return false for a string", () => {
            expect(Text.isReactNode("test")).toBe(false);
        });
        it("should return false for a number", () => {
            expect(Text.isReactNode(123)).toBe(false);
        });
        it("should return false for an array of mixed types", () => {
            expect(Text.isReactNode([<div key="mix-div" />, "teste"])).toBe(false);
        });
    });

    describe('formattedText', () => {
        it("should return children when it is of type React", () => {
            jest.spyOn(Text, 'isReactNode').mockReturnValue(true);
            const element = <div />;
            const result = Text.formattedText(element);
            expect(result).toMatchObject(element);
        });

        it("should return a children when it is neither a React element nor a string", () => {
            jest.spyOn(Text, 'isReactNode').mockReturnValue(false);
            const children = 0;
            const result = Text.formattedText(children);
            expect(result).toEqual(children);
        });

        it('should return the formatted text separated by ++ when children is string', () => {
            jest.spyOn(Text, 'isReactNode').mockReturnValue(false);
            const children = 'Hello ++next line ++World';
            const result = Text.formattedText(children);
            expect(result).toEqual([
                'Hello ',
                expect.objectContaining({ type: 'br' }),
                'next line ',
                expect.objectContaining({ type: 'br' }),
                'World'
            ]);
        });

        it('should return the formatted text separated by * when children is string', () => {
            jest.spyOn(Text, 'isReactNode').mockReturnValue(false);
            const children = 'Hello *strong* World';
            const result = Text.formattedText(children);
            expect(result).toEqual([
                'Hello ',
                expect.objectContaining({
                    type: 'strong',
                    props: expect.objectContaining({ children: ['strong'] })
                }),
                ' World'
            ]);
        });

        it('should return the formatted text separated by _ when children is string', () => {
            jest.spyOn(Text, 'isReactNode').mockReturnValue(false);
            const children = 'Hello _em_ World';
            const result = Text.formattedText(children);
            expect(result).toEqual([
                'Hello ',
                expect.objectContaining({
                    type: 'em',
                    props: expect.objectContaining({ children: ['em'] })
                }),
                ' World'
            ]);
        });

        it('should return undefined when the text is empty after splitting', () => {
            jest.spyOn(Text, 'isReactNode').mockReturnValue(false);
            const result = Text.formattedText('\r\n\r\n');
            expect(result).toEqual([]);
        });

        it('should return the text with the color info-80.', () => {
            jest.spyOn(Text, 'isReactNode').mockReturnValue(false);
            const children = '<info-80>Example</info-80>';
            const result = Text.formattedText(children);
            expect(result).toEqual([
                expect.objectContaining({
                    type: 'span',
                    props: expect.objectContaining({
                        className: 'info-80',
                        children: 'Example',
                    }),
                }),
            ]);
        });
    });

    describe('translateText', () => {
        it('should return text when dont received translator', () => {
            expect(Text.translateText({ text: 'test' })).toEqual('test');
        });

        it('should return text when received translator and dont received text and name', () => {
            const mockTranslator = jest.fn(() => 'translated') as unknown as  TranslatorFunction;
            expect(Text.translateText({ translator: mockTranslator })).toBeUndefined();
        });

        it('should return text when translator is equal name', () => {
            const mockTranslator = jest.fn(() => 'test') as unknown as  TranslatorFunction;
            expect(Text.translateText({ translator: mockTranslator, name: 'test', text: 'test' })).toEqual('test');
        });

        it('should return translated by name when translator is not equal name', () => {
            const mockTranslator = jest.fn(() => 'translated') as unknown as  TranslatorFunction;
            expect(Text.translateText({ translator: mockTranslator, name: 'test', text: 'test' })).toEqual('translated');
        });

        it('should return text when translated by text', () => {
            mockRemovePunctuationAndSpaces.mockReturnValue({ cleaned: 'translated', punctuation: [] });
            const mockTranslator = jest.fn(() => 'translated') as unknown as  TranslatorFunction;
            expect(Text.translateText({ translator: mockTranslator, text: 'Test' })).toEqual('Test');
            expect(mockRemovePunctuationAndSpaces).toHaveBeenCalledWith('Test');
        });

        it('should return translated by text', () => {
            mockRemovePunctuationAndSpaces.mockReturnValue({ cleaned: 'Test', punctuation: [] });
            mockRestorePunctuationAtEnd.mockReturnValue('Test');
            const mockTranslator = jest.fn(() => 'Test') as unknown as  TranslatorFunction;
            expect(Text.translateText({ translator: mockTranslator, text: 'Test' })).toEqual('Test');
            expect(mockRemovePunctuationAndSpaces).toHaveBeenCalledWith('Test');
            expect(mockRestorePunctuationAtEnd).toHaveBeenCalledWith('Test', undefined);
        });
    });

    describe('translateValue', () => {
        it('should return value when dont received translator', () => {
            expect(Text.translateValue( 'test' )).toEqual('test');
        });

        it('should return translated when value is equal string', () => {
            const mockTranslator = jest.fn(() => 'translated') as unknown as  TranslatorFunction;
            const result = Text.translateValue('test', 'test', mockTranslator, undefined);
            expect(result).toEqual('translated');
        });

        it('should return translated when value is equal array with more than one position', () => {
            mockRemovePunctuationAndSpaces.mockReturnValue({ cleaned: 'text', punctuation: [] });
            mockRestorePunctuationAtEnd.mockReturnValue('translated');
            const mockTranslator = jest.fn(() => 'translated') as unknown as  TranslatorFunction;
            const result = Text.translateValue(['test', 'test'], 'test', mockTranslator, undefined);
            expect(result).toEqual(['translated','translated']);
        });

        it('should return text when value is equal array with more than one position with value equal number', () => {
            const mockTranslator = jest.fn(() => 'translated') as unknown as  TranslatorFunction;
            const result = Text.translateValue([1, 2], 'test', mockTranslator, undefined);
            expect(result).toEqual([1,2]);
        });

        it('should return translated when value is equal array with one position', () => {
            const mockTranslator = jest.fn(() => 'translated') as unknown as  TranslatorFunction;
            const result = Text.translateValue(['test'], 'test', mockTranslator, undefined);
            expect(result).toEqual('translated');
        });

        it('should return empty string when value is equal array with one position undefined', () => {
            const mockTranslator = jest.fn(() => 'translated') as unknown as  TranslatorFunction;
            const result = Text.translateValue([undefined], 'test', mockTranslator, undefined);
            expect(result).toEqual('translated');
        });

        it('should return value when value is not string or array', () => {
            const mockTranslator = jest.fn(() => 'translated') as unknown as  TranslatorFunction;
            const result = Text.translateValue(1, 'test', mockTranslator, undefined);
            expect(result).toEqual(1);
        })
    })

});