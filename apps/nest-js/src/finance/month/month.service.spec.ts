import { Repository } from 'typeorm';

import { Test, type TestingModule } from '@nestjs/testing';
import { describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { EMonth } from '@repo/services';

import { MonthBusiness } from '@repo/business';

import { EXPENSE_MOCK, EXPENSE_MONTH_MOCK } from '../../mocks/expense.mock';
import { INCOME_MOCK, INCOME_MONTH_MOCK } from '../../mocks/income.mock';

import { MonthService } from './month.service';

import { type Expense } from '../entities/expense.entity';
import { type Income } from '../entities/incomes.entity';
import { Month } from '../entities/month.entity';

jest.mock('../../shared', () => {
    class ServiceMock {
        save = jest.fn();
        error = jest.fn().mockImplementation((err) => {
            return err;
        });
        seeder = {
            entities: jest.fn(),
            getRelation: jest.fn(),
            currentSeeds: jest.fn(),
        };
        findAll = jest.fn();
        findOne = jest.fn();
    }

    return { Service: ServiceMock }
});

describe('MonthService', () => {
    let service: MonthService;
    let repository: Repository<Month>;
    let business: MonthBusiness;

    const mockIncomeMonthEntity: Month = INCOME_MONTH_MOCK as unknown as Month;
    const mockIncomeEntity: Income = INCOME_MOCK as unknown as Income;
    const mockExpenseMonthEntity: Month = EXPENSE_MONTH_MOCK as unknown as Month;
    const mockExpenseEntity: Expense = EXPENSE_MOCK as unknown as Expense;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MonthService,
                { provide: getRepositoryToken(Month), useClass: Repository },
                { provide: MonthBusiness, useValue: {} }
            ],
        }).compile();

        service = module.get<MonthService>(MonthService);
        repository = module.get<Repository<Month>>(getRepositoryToken(Month));
        business = module.get<MonthBusiness>(MonthBusiness);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('business', () => {
        it('should return expense business module', () => {
            expect(service.business).toBe(business);
        });
    });

    describe('findAllByRelationship', () => {
        it('should return list by expense', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValueOnce([mockExpenseMonthEntity]);
            const result = await service.findAllByRelationship(mockExpenseEntity.id, 'expense');
            expect(result).toEqual([mockExpenseMonthEntity]);
        });

        it('should return list by income', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValueOnce([mockIncomeMonthEntity]);
            const result = await service.findAllByRelationship(mockIncomeEntity.id, 'income');
            expect(result).toEqual([mockIncomeMonthEntity]);
        });
    });

    describe('persistList', () => {
        it('should return throw when dont received income and expense', async () => {
            await expect(service.persistList([], {})).rejects.toThrowError(BadRequestException);
        });

        it('should return throw when received income and expense', async () => {
            await expect(service.persistList([], { income: mockIncomeEntity, expense: mockExpenseEntity })).rejects.toThrowError(BadRequestException);
        });

        it('should persist list of income months without exist months', async () => {
            jest.spyOn(service, 'findAllByRelationship').mockResolvedValueOnce([]);
            jest.spyOn(service, 'save').mockResolvedValueOnce(mockIncomeMonthEntity);
            const result = await service.persistList([mockIncomeMonthEntity], { income: mockIncomeEntity });
            expect(result).toEqual([{ ...mockIncomeMonthEntity, income: undefined, expense: undefined }]);
        });

        it('should persist list of income months with exist months', async () => {
            const mockIncomeNotPersist: Month = { ...mockIncomeMonthEntity, id: '1234', code: 10 };
            jest.spyOn(service, 'findAllByRelationship').mockResolvedValueOnce([mockIncomeMonthEntity, mockIncomeNotPersist]);
            jest.spyOn(service, 'save').mockResolvedValueOnce(mockIncomeMonthEntity);
            jest.spyOn(service, 'save').mockResolvedValueOnce(mockIncomeNotPersist);
            const result = await service.persistList([mockIncomeMonthEntity], { income: mockIncomeEntity });
            expect(result).toEqual([
                { ...mockIncomeMonthEntity, income: undefined, expense: undefined },
                { ...mockIncomeNotPersist, income: undefined, expense: undefined },
            ]);
        });

        it('should persist list of expense months without exist months', async () => {
            jest.spyOn(service, 'findAllByRelationship').mockResolvedValueOnce([]);
            jest.spyOn(service, 'save').mockResolvedValueOnce(mockExpenseMonthEntity);
            const result = await service.persistList([mockExpenseMonthEntity], { expense: mockExpenseEntity });
            expect(result).toEqual([{ ...mockExpenseMonthEntity, income: undefined, expense: undefined }]);
        });

        it('should persist list of expense months when dont have code', async () => {
            const expenseMonthsExpected = { ...mockExpenseMonthEntity, code: undefined, month: EMonth.JANUARY }
            jest.spyOn(service, 'currentMonthNumber' as any).mockReturnValue(1);
            jest.spyOn(service, 'findAllByRelationship').mockResolvedValueOnce([]);
            jest.spyOn(service, 'save').mockResolvedValueOnce(mockExpenseMonthEntity);
            const result = await service.persistList([expenseMonthsExpected], { expense: mockExpenseEntity });
            expect(result).toEqual([{ ...mockExpenseMonthEntity, income: undefined, expense: undefined }]);
        });
    });

    describe('removeList', () => {
        it('should return throw when dont received income and expense', async () => {
            await expect(service.removeList({})).rejects.toThrowError(BadRequestException);
        });

        it('should return throw when received income and expense', async () => {
            await expect(service.removeList({ income: mockIncomeEntity, expense: mockExpenseEntity })).rejects.toThrowError(BadRequestException);
        });

        it('should remove list of income months', async () => {
            jest.spyOn(service, 'findAllByRelationship').mockResolvedValueOnce([mockIncomeMonthEntity]);
            jest.spyOn(repository, 'softRemove').mockResolvedValueOnce(mockIncomeMonthEntity);
            const result = await service.removeList({ income: mockIncomeEntity });
            expect(result).toEqual({ message: `All Months by income Successfully removed` });
        });

        it('should remove list of expense months', async () => {
            jest.spyOn(service, 'findAllByRelationship').mockResolvedValueOnce([mockExpenseMonthEntity]);
            jest.spyOn(repository, 'softRemove').mockResolvedValueOnce(mockExpenseMonthEntity);
            const result = await service.removeList({ expense: mockExpenseEntity });
            expect(result).toEqual({ message: `All Months by expense Successfully removed` });
        });

        it('should return message when dont have months do remove', async () => {
            jest.spyOn(service, 'findAllByRelationship').mockResolvedValueOnce([]);
            const result = await service.removeList({ expense: mockExpenseEntity });
            expect(result).toEqual({ message: `No months found in expense to remove.` });
        });
    });

    describe('privates', () => {
        describe('currentMonthNumber', () => {
            it('should return current month number', () => {
                expect(service['currentMonthNumber']('january')).toEqual(1);
            });

            it('should return throw error when month is not exist', () => {
                expect(() => service['currentMonthNumber']('saturday')).toThrowError(new Error('The month provided is invalid: saturday'));
            });
        });
    });
});
