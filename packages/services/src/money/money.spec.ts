import { describe, expect, it } from '@jest/globals';

import { currencyFormatter, digitsToDecimalString, removeCurrencyFormatter } from './money';

describe('currencyFormatter', () => {
    it('should return formatted currency number when currency is received', () => {
        expect(currencyFormatter(9.99)).toEqual('R$ 9,99');
    });

    it('should return formatted string when currency is received', () => {
        expect(currencyFormatter('9.99')).toEqual('R$ 9,99');
    });

    it('should return formatted string empty when currency is empty string', () => {
        expect(currencyFormatter('')).toEqual('');
    });
});

describe('removeCurrencyFormatter', () => {
    it('should return number when received currency', () => {
        expect(removeCurrencyFormatter('R$ 900')).toEqual(900);
    });
});

describe('digitsToDecimalString', () => {
    it('should return string when received digits', () => {
        expect(digitsToDecimalString('0458')).toEqual('4.58');
    });

    it('should return string empty when received digits empty', () => {
        expect(digitsToDecimalString('')).toEqual('');
    });

    it('should return "0.00" when received a single zero', () => {
        expect(digitsToDecimalString('R$ 0,00')).toEqual('0.00');
    });

})