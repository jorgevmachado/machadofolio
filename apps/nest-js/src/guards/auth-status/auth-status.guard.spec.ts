import { type ExecutionContext, ForbiddenException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { Reflector } from '@nestjs/core';

import { AuthStatusGuard } from './auth-status.guard';

describe('AuthStatusGuard', () => {
  let reflector: Reflector;
  let guard: AuthStatusGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new AuthStatusGuard(reflector);
  });
  
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when no status is required.', () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { status: 'ACTIVE' },
        }),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    const result = guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('must allow access when the users status is valid.', () => {
    const requiredStatus = ['ACTIVE', 'COMPLETE'];

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { status: 'ACTIVE' },
        }),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(requiredStatus);

    const result = guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException when the users status is invalid.', () => {
    const requiredStatus = ['ACTIVE'];

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { status: 'INACTIVE' },
        }),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(requiredStatus);

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(mockContext)).toThrow(
        'You do not have permission to access this resource',
    );
  });
});
