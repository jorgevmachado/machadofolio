import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { EMonth } from '@repo/services';

import { BILL_MOCK } from '../../mocks/bill.mock';
import { type Bill } from '../entities/bill.entity';
import { EXPENSE_MOCK } from '../../mocks/expense.mock';
import { type Expense } from '../entities/expense.entity';
import { USER_MOCK } from '../../mocks/user.mock';
import { type User } from '../../auth/entities/user.entity';

import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { type CreateBillDto } from './dto/create-bill.dto';
import { type CreateExpenseDto } from './expense/dto/create-expense.dto';
import { type UpdateBillDto } from './dto/update-bill.dto';
import { type UpdateExpenseDto } from './expense/dto/update-expense.dto';
import { Readable } from 'stream';

describe('BillController', () => {
    let controller: BillController;
    let service: BillService;

    const mockEntity: Bill = BILL_MOCK;
    const userMockEntity: User = USER_MOCK;
    const expenseMockEntity: Expense = EXPENSE_MOCK;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BillController],
            providers: [
                {
                    provide: BillService,
                    useValue: {
                        list: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        findOne: jest.fn(),
                        findAll: jest.fn(),
                        addExpense: jest.fn(),
                        updateExpense: jest.fn(),
                        removeExpense: jest.fn(),
                        findOneExpense: jest.fn(),
                        findAllExpense: jest.fn(),
                        persistExpenseByUpload: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<BillController>(BillController);
        service = module.get<BillService>(BillService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('Should return an list of bills', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue([mockEntity]);

            expect(await controller.findAll(userMockEntity, {})).toEqual([mockEntity]);
        });
    });

    describe('create', () => {
        it('should create a new bill and save it', async () => {
            const createBill: CreateBillDto = {
                type: mockEntity.type,
                year: mockEntity.year,
                bank: mockEntity.bank.name,
                group: mockEntity.group.name,
            };
            jest.spyOn(service, 'create').mockResolvedValue(mockEntity);

            expect(await controller.create(userMockEntity, createBill)).toEqual(
                mockEntity,
            );
        });
    });

    describe('update', () => {
        it('should update a bill and save it', async () => {
            const updateBill: UpdateBillDto = {
                type: mockEntity.type,
                bank: mockEntity.bank.name,
                group: mockEntity.group.name,
                expenses: mockEntity.expenses,
            };
            jest.spyOn(service, 'update').mockResolvedValue(mockEntity);

            expect(
                await controller.update(userMockEntity, mockEntity.id, updateBill),
            ).toEqual(mockEntity);
        });
    });

    describe('findOne', () => {
        it('Should return one bill', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockEntity);

            expect(await controller.findOne(mockEntity.name)).toEqual(mockEntity);
        });
    });

    describe('remove', () => {
        it('should remove a bill successfully', async () => {
            jest
                .spyOn(service, 'remove')
                .mockResolvedValueOnce({ message: 'Successfully removed' });

            expect(await controller.remove(mockEntity.id)).toEqual({
                message: 'Successfully removed',
            });
        });
    });

    describe('createExpense', () => {
        it('should create a new expense and save it', async () => {
            const createExpense: CreateExpenseDto = {
                type: expenseMockEntity.type,
                value: 100.0,
                month: EMonth.MARCH,
                supplier: expenseMockEntity.supplier.name,
                instalment_number: 1,
            };
            jest.spyOn(service, 'addExpense').mockResolvedValue(expenseMockEntity);

            expect(await controller.addExpense(mockEntity.id, createExpense)).toEqual(
                expenseMockEntity,
            );
        });
    });

    describe('findAllExpenseByBill', () => {
        it('should find a list of expense by bill', async () => {
            jest.spyOn(service, 'findAllExpense').mockResolvedValue([expenseMockEntity]);

            expect(await controller.findAllExpenseByBill(mockEntity.id, {})).toEqual([expenseMockEntity]);
        });
    });

    // describe('persistExpenseByUpload', () => {
    //     const mockedStream = new Readable();
    //     mockedStream.push('mock stream content');
    //     mockedStream.push(null);
    //     const mockFile: Express.Multer.File = {
    //         fieldname: 'file',
    //         originalname: 'test-image.jpeg',
    //         encoding: '7bit',
    //         mimetype: 'image/jpeg',
    //         size: 1024,
    //         buffer: Buffer.from('mock file content'),
    //         destination: 'uploads/',
    //         filename: 'test-image.jpeg',
    //         path: 'uploads/test-image.jpeg',
    //         stream: mockedStream,
    //     };
    //
    //     it('should persist expenses by upload', async () => {
    //         jest.spyOn(service, 'persistExpenseByUpload').mockResolvedValue([expenseMockEntity]);
    //         expect(await controller.persistExpenseByUpload(mockFile, mockEntity.id, {})).toHaveLength(1);
    //     });
    // });
});
