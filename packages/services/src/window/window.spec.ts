import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { documentCookie, isBrowser, isDocument } from './window';

describe('Window function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('Window function', () => {
        describe('isBrowser', () => {
            const windowMock = {
                location: {},
                document: {},
                navigator: {},
            };

            beforeEach(() => {
                jest.clearAllMocks();
                jest.restoreAllMocks();
                Object.defineProperty(global, 'window', {
                    value: windowMock,
                    writable: true,
                });
            });

            afterEach(() => {
                jest.resetModules();
                Object.defineProperty(global, 'window', { value: undefined });
            });

            it('returns true when browser exist', () => {
                Object.defineProperty(global, 'window', { value: windowMock });
                expect(isBrowser()).toBe(true);
            });

            it('returns false when browser does not exist', () => {
                Object.defineProperty(global, 'window', { value: undefined });
                expect(isBrowser()).toBe(false);
            });
        });

        describe('isDocument', () => {
            const documentMock = {};

            beforeEach(() => {
                Object.defineProperty(global, 'document', {
                    value: documentMock,
                    writable: true,
                });
            });

            afterEach(() => {
                Object.defineProperty(global, 'document', { value: undefined });
            });

            it('returns true when document exist', () => {
                Object.defineProperty(global, 'document', { value: documentMock });
                expect(isDocument()).toBe(true);
            });

            it('returns false when document not exist', () => {
                Object.defineProperty(global, 'document', { value: undefined });
                expect(isDocument()).toBe(false);
            });
        });

        describe('documentCookie', () => {
            const documentMock = {
                cookie: 'accessToken=123;',
            };

            afterEach(() => {
                Object.defineProperty(global, 'document', { value: undefined, writable: true, });
            });

            it('returns cookie when document exist', () => {
                Object.defineProperty(global, 'document', { value: documentMock, writable: true, });
                expect(documentCookie()).toBe('accessToken=123;');
            });

            it('returns empty when document not exist', () => {
                Object.defineProperty(global, 'document', { value: undefined, writable: true, });
                expect(documentCookie()).toBe('');
            });

            it('returns empty when document not exist', () => {
                expect(documentCookie()).toBe('');
            });
        });
    });
});