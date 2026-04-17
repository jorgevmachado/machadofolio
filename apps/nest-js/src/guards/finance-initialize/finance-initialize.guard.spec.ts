import { ConflictException, type ExecutionContext } from '@nestjs/common';
import { beforeEach, describe, expect, it } from '@jest/globals';


import { FinanceInitializeGuard } from './finance-initialize.guard';

describe('FinanceInitializeGuard', () => {
  let guard: FinanceInitializeGuard;

  beforeEach(() => {
    guard = new FinanceInitializeGuard();
  });


  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when user has "finance" initialize', () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { finance: true },
        }),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;

    const result = guard.canActivate(
        mockExecutionContext as ExecutionContext,
    );

    expect(result).toBe(true);
  });

  it('should throw a ConflictException when the user does NOT have "finance" initialized.', () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { finance: false },
        }),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockExecutionContext as ExecutionContext))
        .toThrow(ConflictException);
  });

  it('should throw a ConflictException if the user does not own the "finance" property.', () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: {},
        }),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockExecutionContext as ExecutionContext))
        .toThrow(ConflictException);
  });

  it('A ConflictException should be thrown if there is no user in the request.', () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: null,
        }),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockExecutionContext as ExecutionContext))
        .toThrow(ConflictException);
  });

});
