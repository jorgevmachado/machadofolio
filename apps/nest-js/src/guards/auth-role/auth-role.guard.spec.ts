import { type ExecutionContext, ForbiddenException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { Reflector } from '@nestjs/core';

import { AuthRoleGuard } from './auth-role.guard';

describe('AuthRoleGuard', () => {
  let reflector: Reflector;
  let guard: AuthRoleGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new AuthRoleGuard(reflector);
  });


  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when no role is required.', () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { role: 'user' },
        }),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    const result = guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('must allow access when the users role is valid.', () => {
    const requiredRoles = ['admin', 'user'];

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { role: 'user' },
        }),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(requiredRoles);

    const result = guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException when the users role is invalid.', () => {
    const requiredRoles = ['admin'];

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { role: 'user' },
        }),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(requiredRoles);

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(mockContext)).toThrow(
        'You do not have permission to access this resource',
    );
  });


});
