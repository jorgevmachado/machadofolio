import { ExecutionContext } from '@nestjs/common';
import { OptionalAuthGuard } from './optional-auth.guard';

describe('OptionalAuthGuard', () => {
  let guard: OptionalAuthGuard;
  let parentProto: any;

  beforeEach(() => {
    guard = new OptionalAuthGuard();
    parentProto = Object.getPrototypeOf(Object.getPrototypeOf(guard));
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('Should return true when no Authorization header is present', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers: {} }),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;
    const canActivateSpy = jest.spyOn(parentProto, 'canActivate');
    const result = await guard.canActivate(mockExecutionContext as ExecutionContext);
    expect(result).toBe(true);
    expect(canActivateSpy).not.toHaveBeenCalled();
  });

  it('Should return true when has Authorization header is present', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers: { authorization: 'Bearer token' } }),
        getResponse: jest.fn(),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;

    const canActivateSpy = jest.spyOn(parentProto, 'canActivate').mockResolvedValue(true);
    const result = await guard.canActivate(mockExecutionContext as ExecutionContext);
    expect(canActivateSpy).toHaveBeenCalledWith(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('Should return false when parent canActivate returns false', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers: { authorization: 'Bearer token' } }),
        getResponse: jest.fn(),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;
    const canActivateSpy = jest.spyOn(parentProto, 'canActivate').mockResolvedValue(false);
    const result = await guard.canActivate(mockExecutionContext as ExecutionContext);
    expect(result).toBe(false);
    expect(canActivateSpy).toHaveBeenCalledWith(mockExecutionContext);
  });

  it('Should propagate error from parent canActivate', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers: { authorization: 'Bearer token' } }),
        getResponse: jest.fn(),
      }),
      getHandler: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;
    const error = new Error('Auth error');
    jest.spyOn(parentProto, 'canActivate').mockRejectedValue(error);
    await expect(guard.canActivate(mockExecutionContext as ExecutionContext)).rejects.toThrow('Auth error');
  });
});
