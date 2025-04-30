import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { mobileValidator } from '@repo/services/contact/contact';

import { validateMobile } from './config';

jest.mock('@repo/services/contact/contact');

const mockPhone: string = '(11) 99456-7890';
const mockPhoneFormatted: string = '11994567890';

describe('config utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
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
    });

    it('should throw error if number is invalid', () => {
      const mockValidatorErrorResponse = {
        valid: false,
        message: 'Please enter a valid mobile number.',
      };
      const value = '123';

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