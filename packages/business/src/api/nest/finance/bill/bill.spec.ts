import { ReplaceWordParam } from '@repo/services';

const mockUrlToBlob = jest.fn()
jest.mock('@repo/services', () => {
  const originalModule = jest.requireActual('@repo/services') as Record<string, any>;
  return {
    ...originalModule,
    urlToBlob: mockUrlToBlob,
  }
});

jest.mock('../../abstract', () => {
    class NestModuleAbstract {
        public pathUrl: string;
        public get = jest.fn<(...args: any[]) => Promise<any>>();
        public post = jest.fn<(...args: any[]) => Promise<any>>();
        public path = jest.fn<(...args: any[]) => Promise<any>>();
        public getAll = jest.fn<(...args: any[]) => Promise<any>>();
        constructor(config: any) {
            this.pathUrl = config?.pathUrl;
        }
    }

    return { NestModuleAbstract };
});

jest.mock('./expense', () => ({ Expense: jest.fn() }));

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { Bill } from './bill';
import { Expense } from './expense';

describe('Bill', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };
    const year = new Date().getFullYear();
    const mockEntity = {
      id: '4245135e-0e58-48fc-8fd2-9353d0f56c34',
      year,
      type: 'BANK_SLIP',
      name: 'Ingrid Residential Bank Slip',
      total: 4110,
      name_code: 'ingrid_residential_bank_slip',
      all_paid: false,
      total_paid: 2610,
      created_at: '2025-04-02T19:11:59.385Z',
      updated_at: '2025-04-02T19:11:59.385Z',
      deleted_at: null
    }

    let bill: Bill;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        bill = new Bill(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('expenseModule', () => {
        it('should initialize expense module', () => {
            expect(Expense).toHaveBeenCalledTimes(1);
            expect(Expense).toHaveBeenCalledWith(mockConfig);
        });
        it('should return the instance of expense via type getter', () => {
            const expenseModule = bill.expense;
            expect(expenseModule).toBeInstanceOf(Expense);
            expect(Expense).toHaveBeenCalledTimes(1);
        });
    });

    describe('upload', () => {
      it('Should upload with correct url and parameters for upload', async () => {

        mockUrlToBlob.mockImplementation((file) => {
          return new Blob([file as string], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        });

        const mockFile = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQACAgIACGo1==';
        (bill.post as any).mockResolvedValueOnce([mockEntity]);
        const path = 'finance/bill/upload';
        const replaceWords: Array<ReplaceWordParam> = [{
          before: 'test',
          after: 'Test'
        }];
        const repeatedWords: Array<string> = ['test'];

        const result = await bill.upload({
          paid: true,
          file: mockFile,
          replaceWords,
          repeatedWords
        });

        expect(bill.post).toHaveBeenCalledTimes(1);
        // @ts-ignore
        const calledFormData = bill.post.mock.calls[0][1].body;
        const actualFields = {};
        for (const [key, value] of calledFormData.entries()) {
          if (!actualFields[key]) actualFields[key] = [];
          actualFields[key].push(value);
        }
        expect(actualFields['paid']).toBeTruthy();
        const file = actualFields['file'][0];
        expect(file).toBeInstanceOf(Blob);
        expect(file.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        expect(file.size).toBeGreaterThan(0);

        expect(actualFields['replaceWords[]']).toHaveLength(replaceWords.length);
        expect(actualFields['replaceWords[]']).toEqual(["{\"before\":\"test\",\"after\":\"Test\"}"]);


        expect(actualFields['repeatedWords[]']).toHaveLength(repeatedWords.length);
        repeatedWords.forEach((item, idx) => {
          expect(actualFields['repeatedWords[]'][idx]).toBe(String(item));
        });

        // @ts-ignore
        expect((bill.post.mock.calls[0][0])).toBe(path);
        expect(result).toEqual([mockEntity]);
      })
    });
});