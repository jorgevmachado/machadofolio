import fetchMock from 'jest-fetch-mock';

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { INVALID_TYPE, REQUIRED_FIELD } from '../shared';

import * as file from './file';
import { urlToBlob } from './file';

describe('File function', () => {
    let OriginalFileReader: any;
    let OriginalFetch: any;

    const mockBlob = new Blob(['test content'], { type: 'text/plain' });

    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock.resetMocks();
    });


    afterEach(() => {
        jest.resetModules();
    });

    beforeAll(() => {
        OriginalFileReader = global.FileReader;

        OriginalFetch = global.fetch;
    });

    afterAll(() => {
        global.FileReader = OriginalFileReader;
        global.fetch = OriginalFetch;
    });

    describe('imageTypeValidator', () => {
        it('should return valid when received valid image type', () => {
            const accept = 'image/*';
            expect(file.imageTypeValidator({ accept })).toEqual({
                valid: true,
                accept,
                message: 'Valid image type.',
            });
        });

        it('should return valid when received .png, .jpeg', () => {
            const accept = '.png,.jpeg';
            expect(file.imageTypeValidator({ accept })).toEqual({
                valid: true,
                accept,
                message: 'Valid image type.',
            });
        });

        it('should return invalid when received invalid image type', () => {
            expect(file.imageTypeValidator({ accept: 'application/pdf' })).toEqual({
                valid: false,
                message: 'Please enter a valid image type.',
            });
        });

        it('should return invalid when received in accepting a different type of image.', () => {
            expect(file.imageTypeValidator({ accept: '.png,.jpeg,.pdf' })).toEqual({
                valid: false,
                message: 'Please enter a valid image type.',
            });
        });

        it('should return invalid when received undefined image type', () => {
            expect(file.imageTypeValidator({})).toEqual(REQUIRED_FIELD);
        });
    });

    describe('fileBase64Validator', () => {
        it('should return invalid when received undefined file Base64', () => {
            expect(file.fileBase64Validator({})).toEqual(REQUIRED_FIELD);
        });

        it('should return invalid when received invalid  file Base64 type', () => {
            expect(file.fileBase64Validator({ value: new Date() })).toEqual(INVALID_TYPE);
        });

        it('should return valid when received valid  file Base64 type', () => {
            const value = 'data:image/png;base64,mocked-data';
            expect(file.fileBase64Validator({ value })).toEqual({
                valid: true,
                value,
                message: 'Valid file.',
            });
        });
    });

    describe('fileToBase64', () => {
        it('converte um arquivo em base64', async () => {
            const fakeFile = new global.Blob(['test'], { type: 'text/plain' }) as File;
            const res = await file.fileToBase64(fakeFile);
            expect(res).toBe('data:base64,mocked-data');
        });

        it('rejeita caso ocorram erros no FileReader', async () => {
            const fakeFile = new global.Blob(['test'], { type: 'text/plain' }) as File;
            // Ativa o erro no próximo FileReader instanciado
            (global as any).__shouldFileReaderFail = true;

            await expect(file.fileToBase64(fakeFile)).rejects.toThrow('Simulated error');

            // Reseta para não quebrar outros testes
            (global as any).__shouldFileReaderFail = false;
        });
    });

    describe('urlToBase64', () => {
        it('must fetch a url, convert it to blob and return base64.', async () => {

            jest.spyOn(file, 'urlToBlob').mockResolvedValueOnce(mockBlob);

            // fetchMock.mockResponseOnce(
            //     () => Promise.resolve({ body: 'MOCK_BLOB_FOR_URL', status: 200 })
            // );


            const result = await file.urlToBase64('https://site/img.jpg');
            // expect(fetchMock).toBeCalledWith('https://site/img.jpg');
            expect(result).toBe('data:base64,mocked-data');
        });

        it('should reject when error occurs in FileReader.', async () => {
            jest.spyOn(file, 'urlToBlob').mockResolvedValueOnce(mockBlob);

            (global as any).__shouldFileReaderFail = true;

            await expect(file.urlToBase64('https://site/img.jpg')).rejects.toThrow('Simulated error');

            (global as any).__shouldFileReaderFail = false;
        });
    });

    describe('extractExtensionFromBase64', () => {
        it('should extract the extension from a base64 string', () => {
            const mockBase64 = 'data:image/png;base64,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';
            expect(file.extractExtensionFromBase64(mockBase64)).toBe('png');
        });

        it('should extract the extension xlsx from a base64 string when mimeType is vnd.openxmlformats-officedocument.spreadsheetml.sheet', () => {
            const mockBase64 = 'data:vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,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';
            expect(file.extractExtensionFromBase64(mockBase64)).toBe('xlsx');
        });

        it('should return undefined if no valid base64 string is provided', () => {
            const invalidBase64 = 'text/plain;base64,SGVsbG8sIFdvcmxkIQ==';
            expect(file.extractExtensionFromBase64(invalidBase64)).toBeUndefined();
        });
    });

    describe('urlToBlob', () => {
        it('should fetch the url and return a Blob', async () => {
            const mockBlob = new Blob(['test content'], { type: 'text/plain' });
            const mockResponse = new Response(null, { status: 200 });
            jest.spyOn(mockResponse, 'blob').mockResolvedValue(mockBlob);
            // @ts-ignore
            (global.fetch as unknown as (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) = jest.fn().mockResolvedValue(mockResponse);


            const result = await urlToBlob('https://fake-url.com/test.txt');
            expect(global.fetch).toHaveBeenCalledWith('https://fake-url.com/test.txt');
            expect(result).toBe(mockBlob);
        });
    });
});