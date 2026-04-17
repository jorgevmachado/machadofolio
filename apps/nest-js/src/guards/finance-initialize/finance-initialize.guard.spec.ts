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

  it('deve retornar true quando o usuário possui "finance" inicializado', () => {
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

  it('deve lançar ConflictException quando o usuário NÃO possui "finance" inicializado', () => {
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

  it('deve lançar ConflictException se o usuário não possuir a propriedade "finance"', () => {
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

  it('deve lançar ConflictException se não houver usuário na requisição', () => {
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
