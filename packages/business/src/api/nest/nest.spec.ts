import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { Auth } from './auth';
import { Nest } from './nest';


jest.mock('./auth');

describe('Nest', () => {
    const mockBaseUrl = 'http://test-url.com';
    const mockToken = 'test-token';
    const mockHeaders = {
        Authorization: `Bearer ${mockToken}`,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('AuthModule', () => {
        it('should create the Auth module with correct config', () => {
            new Nest({ baseUrl: mockBaseUrl, token: mockToken });

            expect(Auth).toHaveBeenCalledTimes(1);
            expect(Auth).toHaveBeenCalledWith({
                baseUrl: mockBaseUrl,
                headers: mockHeaders,
            });
        });
    });
});