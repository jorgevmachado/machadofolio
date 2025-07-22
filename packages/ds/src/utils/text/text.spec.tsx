import React from 'react';

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

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

        it("should return a warning along with children when it is neither a React element nor a string", () => {
            jest.spyOn(Text, 'isReactNode').mockReturnValue(false);
            const children = 0;
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
            const result = Text.formattedText(children);
            expect(result).toEqual(children);
            expect(warnSpy).toHaveBeenCalledWith('Invalid children type. Expected string or ReactNode.');
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

});