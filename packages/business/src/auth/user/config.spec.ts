import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { cleanFormatter, mobileValidator } from '@repo/services';

import { validateMobile } from './config';

jest.mock('@repo/services', () => ({
  cleanFormatter: jest.fn(),
  mobileValidator: jest.fn(),
}));

const mockPhone: string = '(11) 99456-7890';
const mockPhoneFormatted: string = '11994567890';

describe('config utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    (cleanFormatter as jest.Mock).mockReturnValue(
        mockPhoneFormatted,
    );
  });
  afterEach(() => {
    jest.resetModules();
  });

  describe('validateMobile', () => {
    const mockValidatorSuccessResponse = {
      valid: true,
      message: 'Valid mobile number.',
    };
    it('should return the formatted value if it is valid', () => {
      (mobileValidator as jest.Mock).mockReturnValue(
        mockValidatorSuccessResponse,
      );

      const result = validateMobile(mockPhone, true);

      expect(result).toBe(mockPhoneFormatted);
      expect(mobileValidator).toHaveBeenCalledWith({
        value: mockPhoneFormatted,
      });
      expect(cleanFormatter).toHaveBeenCalledWith(mockPhone);
    });

    it('should throw error if number is invalid', () => {
      const mockValidatorErrorResponse = {
        valid: false,
        message: 'Please enter a valid mobile number.',
      };
      const value = '123';

      (cleanFormatter as jest.Mock).mockReturnValue(value);

      (mobileValidator as jest.Mock).mockReturnValue(
        mockValidatorErrorResponse,
      );

      expect(() => validateMobile(value, true)).toThrow(
        mockValidatorErrorResponse.message,
      );
      expect(mobileValidator).toHaveBeenCalledWith({ value });
    });

    it('should return a valid formatted number while maintaining formatting when cleanAllFormatter is false', () => {

      (mobileValidator as jest.Mock).mockReturnValue(
        mockValidatorSuccessResponse,
      );

      const result = validateMobile(mockPhone, false);

      expect(result).toBe(mockPhone);
      expect(mobileValidator).toHaveBeenCalledWith({
        value: mockPhoneFormatted,
      });
    });

    it('should throw error when value is undefined', () => {
      (cleanFormatter as jest.Mock).mockReturnValue('');
      const mockValidatorRequiredResponse = {
        valid: false,
        value: undefined,
        message: 'the field is required.',
      };
      (mobileValidator as jest.Mock).mockReturnValue(
        mockValidatorRequiredResponse,
      );

      expect(() => validateMobile(undefined, true)).toThrow(
        mockValidatorRequiredResponse.message,
      );
      expect(mobileValidator).toHaveBeenCalledWith({ value: '' });
    });
  });
});