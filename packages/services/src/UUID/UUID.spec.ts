import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { validate as isUuid, v4 as uuidv4 } from 'uuid';

import {generateUUID, isUUID} from "./UUID";

jest.mock('uuid');


describe('Uuid function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('Uuid function', () => {
        describe('generateUUID', () => {
            const mockUuid = 'cb72ea3b-82a5-45a6-a96f-b906457f065d';
            it('should return uuid based on prefix it receives', () => {
                const expectedResult = `prefix-${mockUuid}`;
                (uuidv4 as jest.Mock).mockReturnValue(mockUuid);
                const result = generateUUID('prefix');
                expect(result).toEqual(expectedResult);
                expect(uuidv4).toHaveBeenCalledTimes(1);
            });
            it('should return uuid', () => {
                (uuidv4 as jest.Mock).mockReturnValue(mockUuid);
                const result = generateUUID();
                expect(result).toEqual(mockUuid);
                expect(uuidv4).toHaveBeenCalledTimes(1);
            });
        });

        describe('isUUID', () => {
            it('Must validate if it is a uuid', () => {
                (isUuid as jest.Mock).mockReturnValue(true);
                expect(isUUID('cb72ea3b-82a5-45a6-a96f-b906457f065d')).toBeTruthy();
            });
        });
    });
});