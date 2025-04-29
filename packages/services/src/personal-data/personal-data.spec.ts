import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import {INVALID_TYPE, REQUIRED_FIELD} from "../shared";

import {cpfFormatter, cpfValidator, genderValidator, nameValidator} from "./personal-data";


describe('PersonalData function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('cpfFormatter', () => {
        it('should return a formatted cpf when the string is received', () => {
            expect(cpfFormatter('00000000000')).toEqual('000.000.000-00');
        });

        it('should return an empty string cpf when string is not received', () => {
            expect(cpfFormatter()).toEqual('');
        });
    });

    describe('cpfValidator', () => {
        it('should return valid when received valid cpf with mask', () => {
            const value = '515.516.165-72';
            expect(cpfValidator({ value })).toEqual({
                valid: true,
                value,
                message: 'Valid CPF.',
            });
        });

        it('should return valid when received valid cpf without mask', () => {
            const value = '51551616572';
            expect(cpfValidator({ value })).toEqual({
                valid: true,
                value,
                message: 'Valid CPF.',
            });
        });

        it('should return invalid when received invalid cpf', () => {
            expect(cpfValidator({ value: '515516165722' })).toEqual({
                valid: false,
                message: 'Please enter a valid cpf number.',
            });
        });

        it('should return invalid when received undefined cpf', () => {
            expect(cpfValidator({})).toEqual(REQUIRED_FIELD);
        });

        it('should return invalid when received invalid cpf type', () => {
            expect(cpfValidator({ value: new Date() })).toEqual(INVALID_TYPE);
        });
    });

    describe('genderValidator', () => {
        it('should return valid when received female gender', () => {
            const value = 'female';
            expect(genderValidator({ value })).toEqual({
                valid: true,
                value,
                message: 'Valid gender.',
            });
        });
        it('should return valid when received male gender', () => {
            const value = 'MALE';
            expect(genderValidator({ value })).toEqual({
                valid: true,
                value,
                message: 'Valid gender.',
            });
        });
        it('should return valid when received other gender', () => {
            const value = 'other';
            expect(genderValidator({ value })).toEqual({
                valid: true,
                value,
                message: 'Valid gender.',
            });
        });

        it('should return invalid when received invalid gender', () => {
            expect(genderValidator({ value: 'people' })).toEqual({
                valid: false,
                message: 'Invalid Gender.',
            });
        });
        it('should return invalid when received undefined gender', () => {
            expect(genderValidator({})).toEqual(REQUIRED_FIELD);
        });

        it('should return invalid when received invalid gender type', () => {
            expect(genderValidator({ value: new Date() })).toEqual(INVALID_TYPE);
        });
    });

    describe('nameValidator', () => {
        const value = 'Harry';
        it('should return valid when received valid name', () => {
            expect(nameValidator({ value })).toEqual({
                valid: true,
                value,
                message: 'Valid name.',
            });
        });
        it('should return invalid when received undefined name', () => {
            expect(nameValidator({})).toEqual(REQUIRED_FIELD);
        });

        it('should return invalid when received invalid name type', () => {
            expect(nameValidator({ value: new Date() })).toEqual(INVALID_TYPE);
        });
    });
});