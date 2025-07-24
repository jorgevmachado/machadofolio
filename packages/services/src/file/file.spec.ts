import fetchMock from 'jest-fetch-mock';

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { REQUIRED_FIELD } from '../shared';

import { fileToBase64, imageTypeValidator, urlToBase64 } from './file';

describe('File function', () => {
    let OriginalFileReader: any;
    let OriginalFetch: any;

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
            expect(imageTypeValidator({ accept })).toEqual({
                valid: true,
                accept,
                message: 'Valid image type.',
            });
        });
        it('should return valid when received .png, .jpeg', () => {
            const accept = '.png,.jpeg';
            expect(imageTypeValidator({ accept })).toEqual({
                valid: true,
                accept,
                message: 'Valid image type.',
            });
        });
        it('should return invalid when received invalid image type', () => {
            expect(imageTypeValidator({ accept: 'application/pdf' })).toEqual({
                valid: false,
                message: 'Please enter a valid image type.',
            });
        });
        it('should return invalid when received in accepting a different type of image.', () => {
            expect(imageTypeValidator({ accept: '.png,.jpeg,.pdf' })).toEqual({
                valid: false,
                message: 'Please enter a valid image type.',
            });
        });
        it('should return invalid when received undefined image type', () => {
            expect(imageTypeValidator({})).toEqual(REQUIRED_FIELD);
        });
    });

    describe('fileToBase64', () => {
        it('converte um arquivo em base64', async () => {
            const fakeFile = new global.Blob(['test'], { type: 'text/plain' }) as File;
            const res = await fileToBase64(fakeFile);
            expect(res).toBe('data:base64,mocked-data');
        });
        it('rejeita caso ocorram erros no FileReader', async () => {
            const fakeFile = new global.Blob(['test'], { type: 'text/plain' }) as File;
            // Ativa o erro no próximo FileReader instanciado
            (global as any).__shouldFileReaderFail = true;

            await expect(fileToBase64(fakeFile)).rejects.toThrow('Simulated error');

            // Reseta para não quebrar outros testes
            (global as any).__shouldFileReaderFail = false;
        });

    });

    describe('urlToBase64', () => {
        it('busca uma url, converte para blob e retorna base64', async () => {

            fetchMock.mockResponseOnce(
                () => Promise.resolve({ body: 'MOCK_BLOB_FOR_URL', status: 200 })
            );


            const result = await urlToBase64('https://site/img.jpg');
            expect(fetchMock).toBeCalledWith('https://site/img.jpg');
            expect(result).toBe('data:base64,mocked-data');
        });
        it('rejeita ao ocorrer erro no FileReader', async () => {
            fetchMock.mockResponseOnce(
                () => Promise.resolve({ body: 'MOCK_BLOB_FOR_URL', status: 200 })
            );
            // Ativa o erro no próximo FileReader instanciado
            (global as any).__shouldFileReaderFail = true;

            await expect(urlToBase64('https://site/img.jpg')).rejects.toThrow('Simulated error');

            (global as any).__shouldFileReaderFail = false;
        });

    });
});