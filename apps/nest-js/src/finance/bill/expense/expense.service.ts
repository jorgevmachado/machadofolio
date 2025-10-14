import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EExpenseType, Expense as ExpenseConstructor, ExpenseBusiness } from '@repo/business';

import { FilterParams, type ListParams, Service } from '../../../shared';

import { Bill } from '../../entities/bill.entity';
import { Expense } from '../../entities/expense.entity';
import { Supplier } from '../../entities/supplier.entity';

import { SupplierService } from '../../supplier/supplier.service';

import { MonthService } from '../../month/month.service';
import { PersistMonthDto } from '../../month/dto/persist-month.dto';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { convertTypeToEnum, getMonthByIndex, splitMonthsByInstalment, Spreadsheet } from '@repo/services';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { UploadsExpenseDto } from './dto/uploads-expense.dto';
import { UploadExpenseDto } from './dto/upload-expense.dto';

// export type InitializeParams = {
//     paid?: ExpenseEntity['paid'];
//     type?: ExpenseEntity['type'];
//     value?: number;
//     month?: ExpenseEntity['month'];
//     expense: Expense;
//     fromWorkSheet?: boolean;
//     instalment_number?: number;
// }
//
// export type ExpenseSeederParams = Pick<FinanceSeederParams, 'expenseListJson' | 'billListJson'> & {
//     bills: Array<Bill>;
//     suppliers: Array<Supplier>;
// }
//
// export type createToSheetParams = Record<string, string | number | boolean | object | Bill>;
//
// type ExpenseGenerateSeeds = {
//     months: Array<Month>;
//     expenses: GenerateSeeds<Expense>;
// }
//
// export type PersistExpenseParams = Omit<CreateExpenseDto, 'month'> & {
//     months: Array<PersistMonthDto>;
// }
//
// export type BuildExpensePersistenceResult = Omit<CreateExpenseDto, 'month'> & {
//     month: PersistMonthDto;
// }

type BuildToCreateResult = {
    nextYear: number;
    requiresNewBill: boolean;
    monthsForNextYear: Array<PersistMonthDto>;
    expenseForNextYear?: Expense;
    monthsForCurrentYear: Array<PersistMonthDto>;
    expenseForCurrentYear: Expense;
    instalmentForNextYear: number;
}

@Injectable()
export class ExpenseService extends Service<Expense> {
    constructor(
        @InjectRepository(Expense)
        protected repository: Repository<Expense>,
        protected expenseBusiness: ExpenseBusiness,
        protected supplierService: SupplierService,
        protected monthService: MonthService
    ) {
        super('expenses', ['supplier', 'bill', 'months', 'children', 'parent'], repository);
    }

    get business(): ExpenseBusiness {
        return this.expenseBusiness;
    }

    async create(bill: Bill, createExpenseDto: CreateExpenseDto) {
        const supplier = await this.supplierService.treatEntityParam<Supplier>(
            createExpenseDto.supplier,
            'Supplier',
        ) as Supplier;

        const parent = await this.treatEntityParentParam(createExpenseDto?.parent);

        const builtExpense = new ExpenseConstructor({
            supplier,
            bill,
            year: bill.year,
            type: createExpenseDto.type,
            paid: Boolean(createExpenseDto.paid),
            parent,
            description: createExpenseDto.description,
            is_aggregate: Boolean(parent),
            aggregate_name: !parent ? undefined : createExpenseDto.aggregate_name,
            instalment_number: createExpenseDto.instalment_number,
        });

        await this.validateExistExpense(bill, builtExpense);

        const buildToCreate = this.buildToCreate(builtExpense, createExpenseDto.months, createExpenseDto.month, createExpenseDto.value);

        const expense = await this.save(buildToCreate.expenseForCurrentYear) as Expense;

        if(buildToCreate.monthsForCurrentYear.length > 0) {
            expense.months = await this.monthService.persistList(buildToCreate.monthsForCurrentYear, { expense });
            const expenseCalculated = this.expenseBusiness.calculate(expense);
            buildToCreate.expenseForCurrentYear = await this.save(expenseCalculated) as Expense;
        }

        return buildToCreate;
    }

    async update(param: string, body: UpdateExpenseDto) {
        const result = await this.findOne({ value: param, withRelations: true }) as Expense;

        const supplier = !body?.supplier
            ? result.supplier
            : await this.supplierService.treatEntityParam<Supplier>(
                body.supplier,
                'Supplier',
            ) as Supplier;

        const updatedExpense = new ExpenseConstructor({
            ...result,
            type: body?.type ?? result.type,
            paid: body?.paid ?? result.paid,
            supplier,
            description: body?.description ?? result?.description
        });

        if(result.name_code !== updatedExpense.name_code) {
            const filters: Array<FilterParams> = [
                {
                    value: updatedExpense.year,
                    param: `${this.alias}.year`,
                    relation: true,
                    condition: '=',
                },
                {
                    value: updatedExpense.name_code,
                    param: `${this.alias}.name_code`,
                    relation: true,
                    condition: 'LIKE',
                }
            ];
            const existingExpense = await this.findAll({ filters, withRelations: true }) as Array<Expense>;
            if(existingExpense.length > 0) {
                throw this.error(new ConflictException(`You cannot update this expense with this (supplier) ${updatedExpense.supplier.name} because there is already an expense linked to this supplier.`));
            }
        }

        const monthsToPersist = this.monthService.business.generateMonthListUpdateParameters(updatedExpense?.months, body.months, body?.paid);
        if(monthsToPersist &&  monthsToPersist?.length > 0) {
            const months = await this.monthService.persistList(monthsToPersist, { expense: updatedExpense });
            updatedExpense.months = months;
            const expenseCalculated = this.expenseBusiness.calculate(updatedExpense);
            const savedExpense = await this.save(expenseCalculated);
            return {...savedExpense, months };
        }
        return await this.save(updatedExpense);
    }

    async remove(value: string, filters: ListParams['filters'] = [], withDeleted: boolean = false) {
        const expense = await this.findOne({ value, filters, withDeleted, withRelations: true }) as Expense;

        if(expense) {
            await this.monthService.removeList({ expense });
            await this.softRemove(expense);
        }

        return { message: 'Successfully removed' };
    }

    async uploads(bill: Bill, files: Express.Multer.File[], uploadsExpenseDto: UploadsExpenseDto) {
        const createExpenseDtoList: Array<CreateExpenseDto> = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!file || !file?.buffer) {
                throw this.error(new ConflictException('one of the files was not uploaded or is invalid.'));
            }

            const spreadsheet = new Spreadsheet();

            const worksheets = await spreadsheet.loadFile(file.buffer);

            const worksheet = worksheets[0];

            if (!worksheet) {
                throw this.error(new ConflictException('The Excel file does not contain any worksheets.'));
            }

            spreadsheet.updateWorkSheet(worksheet);
            const workSheet = spreadsheet.workSheet;

            const month = uploadsExpenseDto?.months?.[i];

            const uploadExpenseDto: UploadExpenseDto = {
                file: '',
                paid: uploadsExpenseDto?.paid?.[i],
                month: !month ? convertTypeToEnum(getMonthByIndex(i)) : month,
                replaceWords: uploadsExpenseDto?.replaceWords,
                repeatedWords: uploadsExpenseDto?.repeatedWords
            }

            const createExpenseDtoListToCreate = this.business.spreadsheet.buildForCreation(workSheet, uploadExpenseDto);
            const createExpenseDtoListToSave: Array<CreateExpenseDto> = [];

            for(const createExpenseDto of createExpenseDtoListToCreate) {
                const supplier = await this.supplierService.createToSheet(createExpenseDto.supplier as string) as Supplier;
                const month = this.monthService.business.generatePersistMonthParams({
                    year: bill.year,
                    paid: createExpenseDto?.paid,
                    value: createExpenseDto?.value,
                    month: createExpenseDto?.month,
                    received_at: createExpenseDto?.received_at
                });
                createExpenseDtoListToSave.push({
                    ...createExpenseDto,
                    months: [month],
                    supplier,
                });
            }

            createExpenseDtoList.push(...createExpenseDtoListToSave);
        }
        const initialPersistExpenseParams: Array<CreateExpenseDto> = [{
            type: EExpenseType.VARIABLE,
            value: 0,
            months: [],
            supplier: '',
            instalment_number: 1,
        }];

        const cleanPersistExpenseParamsBuilt = createExpenseDtoList.reduce((acc, item) => {
            const hasParam = acc.find((accItem) => accItem.supplier['name_code'] === item.supplier['name_code']);
            if(!hasParam) {
                const expenseToSave = createExpenseDtoList.filter((bep) => bep.supplier['name_code'] === item.supplier['name_code']);
                const expenseMonths =  expenseToSave.flatMap((expense) => expense.months).filter((item) => !!item);
                acc.push({
                    type: item.type,
                    paid: item.paid,
                    value: 0,
                    months: expenseMonths,
                    supplier: item.supplier,
                    received_at: item.received_at,
                });
            }
            return acc;
        }, initialPersistExpenseParams).filter((item) => item?.months && item?.months?.length > 0 && item.supplier !== '');

        const expenses: Array<Expense> = [];
        for(const persistExpenseDto of cleanPersistExpenseParamsBuilt) {
            const builtExpense = new ExpenseConstructor({
                supplier: persistExpenseDto.supplier as Supplier,
                bill,
                year: bill.year,
                type: persistExpenseDto.type,
                paid: Boolean(persistExpenseDto.paid),
                description: persistExpenseDto.description,
                instalment_number: 1,
            });

            const existExpense = await this.validateExistExpense(bill, builtExpense);

            const isCreate = !existExpense?.id;

            const savedExpense = isCreate ? await this.save(builtExpense) as Expense : { ...existExpense};

            const expenseMonths: Array<PersistMonthDto> = isCreate
                ? this.monthService.business.generateMonthListCreationParameters({
                    year: savedExpense?.year,
                    paid: savedExpense?.paid,
                    months: persistExpenseDto?.months,
                    received_at: savedExpense?.created_at
                })
                : savedExpense?.months?.map((month) => {
                    const monthToUpdate = persistExpenseDto?.months?.find((monthToUpdate) => monthToUpdate.code === month.code);

                    if(!monthToUpdate) {
                        return month;
                    }

                    month.paid = Boolean(monthToUpdate.paid);
                    month.value = monthToUpdate.value !== month.value ? monthToUpdate.value : month.value;
                    month.received_at = monthToUpdate.received_at !== month.received_at ? monthToUpdate.received_at : month.received_at;
                    return month;
                }) ?? [];

            if(expenseMonths?.length > 0) {
                savedExpense.months = await this.monthService.persistList(expenseMonths, { expense: savedExpense });
                const savedExpenseCalculated = this.expenseBusiness.calculate(savedExpense);
                return await this.save(savedExpenseCalculated);
            }

            expenses.push(savedExpense);
        }

        return expenses;
    }

    private async treatEntityParentParam(value?: string | Expense): Promise<Expense | undefined> {
        try {
            return await this.treatEntityParam<Expense>(
                value,
                'Expense Parent',
            ) as Expense;
        } catch (error) {
            return;
        }
    }

    private async validateExistExpense(bill: Bill, expense: Expense, withThrow: boolean = true) {
        const fallbackMessage = 'You cannot add this expense because it is already in use.';

        const hasExpense = bill.expenses?.find((item) => expense.name_code === item.name_code);

        if (hasExpense && withThrow) {
            throw this.error(new ConflictException(fallbackMessage));
        }

        if (hasExpense && !withThrow) {
            return hasExpense;
        }

        const filters: Array<FilterParams> = [
            {
                value: expense.name_code,
                param: 'expenses.name_code',
                relation: true,
                condition: 'LIKE',
            },
            {
                value: expense.year,
                param: 'expenses.year',
                relation: true,
                condition: '='
            }
        ];
        const result = await this.findAll({ withRelations: true, filters }) as Array<Expense>;

        if (result.length && withThrow) {
            throw this.error(new ConflictException('Expense already exists'));
        }

        return result[0];

    }

    private buildToCreate(expense: Expense, months?: CreateExpenseDto['months'], month?: CreateExpenseDto['month'], value: number = 0): BuildToCreateResult {
        const result: BuildToCreateResult = {
            nextYear: expense.year + 1,
            requiresNewBill: false,
            monthsForNextYear: [],
            expenseForNextYear: undefined,
            monthsForCurrentYear: [],
            expenseForCurrentYear: expense,
            instalmentForNextYear: 0,
        }

        const paramsForCurrentYear = {
            year: expense.year,
            paid: expense.paid,
            value,
            received_at: expense.created_at
        }

        if (months && months?.length > 0) {
            result.monthsForCurrentYear = months.length === 12
                ? months
                : this.monthService.business.generateMonthListCreationParameters({
                    ...paramsForCurrentYear,
                    months,
                });
            return result;
        }

        if (expense.type === EExpenseType.FIXED) {
            result.expenseForCurrentYear = { ...expense, instalment_number: 12 };
            return result;
        }

        const {
            monthsForNextYear,
            monthsForCurrentYear
        } = splitMonthsByInstalment(expense.year, expense.instalment_number, month);

        if (monthsForNextYear.length > 0) {
            result.requiresNewBill = true;
            result.expenseForNextYear = {
                ...expense,
                id: '',
                year: result.nextYear,
                instalment_number: monthsForNextYear.length
            }
            const paramsForNextYear = {
                year: result.nextYear,
                paid: expense.paid,
                value,
                received_at: expense.created_at
            }
            const monthsForNextYearParams = monthsForNextYear.map((month) => this.monthService.business.generatePersistMonthParams({
                ...paramsForNextYear,
                month,
            }));

            result.monthsForNextYear = this.monthService.business.generateMonthListCreationParameters({
                ...paramsForNextYear,
                months: monthsForNextYearParams,
            });
        }

        if(monthsForCurrentYear.length > 0)  {
            const monthsForCurrentYearParams = monthsForCurrentYear.map((month) => this.monthService.business.generatePersistMonthParams({
                ...paramsForCurrentYear,
                month,
            }));

            result.monthsForCurrentYear = this.monthService.business.generateMonthListCreationParameters({
                ...paramsForCurrentYear,
                months: monthsForCurrentYearParams,
            });
        }

        return result;
    }

    //
    // async seeds({
    //                 bills,
    //                 suppliers,
    //                 billListJson,
    //                 expenseListJson,
    //             }: ExpenseSeederParams) {
    //     const seeds = this.seeder.currentSeeds<Expense>({ seedsJson: expenseListJson });
    //     const billListSeed = this.seeder.currentSeeds<Bill>({ seedsJson: billListJson });
    //
    //     const financeBillExpenseListSeed = billListSeed.flatMap((bill) => bill?.expenses ?? []);
    //     const financeExpenseListSeed = filterByCommonKeys<Expense>('id', seeds, financeBillExpenseListSeed);
    //
    //     const currentSeeds = this.flattenParentsAndChildren(financeExpenseListSeed);
    //
    //     const parents = currentSeeds.filter(item => !item.parent);
    //     const children = currentSeeds.filter(item => item.parent);
    //
    //     const parentsSeeded = await this.seeder.entities({
    //         by: 'id',
    //         key: 'id',
    //         label: 'Expense',
    //         seeds: parents,
    //         createdEntityFn: async (item) => this.createdEntity(item, suppliers, bills)
    //     }) as Array<Expense>;
    //
    //     const parentMap = new Map<string, Expense>(parentsSeeded.map(parent => [parent.id, parent]));
    //
    //     const childrenPrepared = children.map(child => ({
    //         ...child,
    //         parent: parentMap.get(child?.parent?.id ?? '')
    //     }))
    //
    //     const expenses = await this.seeder.entities({
    //         by: 'id',
    //         key: 'id',
    //         label: 'Expense',
    //         seeds: childrenPrepared,
    //         withReturnSeed: true,
    //         createdEntityFn: async (item) => this.createdEntity(item, suppliers, bills)
    //     }) as Array<Expense>;
    //
    //     const expenseList: Array<Expense> = [];
    //
    //     for(const expense of expenses) {
    //         const currentExpense = seeds.find(seed => seed.id === expense.id);
    //         if(currentExpense) {
    //             const currentMonths: Array<PersistMonthDto> = MONTHS.map((month) => ({
    //                 year: currentExpense.year,
    //                 code: getCurrentMonthNumber(month),
    //                 paid: currentExpense[`${month}_paid`],
    //                 value: currentExpense[month],
    //                 month: month.toUpperCase() as EMonth,
    //                 received_at: currentExpense.created_at,
    //             }));
    //             expense.months = await this.monthService.persistList(currentMonths, { expense });
    //             const expenseCalculated = this.expenseBusiness.calculate(expense);
    //             const savedExpense = await this.save(expenseCalculated) as Expense;
    //             expenseList.push(savedExpense);
    //             continue;
    //         }
    //         expenseList.push(expense);
    //     }
    //
    //     return expenseList;
    // }
    //
    // private createdEntity(expense: Expense, suppliers: Array<Supplier>, bills: Array<Bill>) {
    //     const supplier = this.seeder.getRelation<Supplier>({
    //         key: 'name',
    //         list: suppliers,
    //         relation: 'Supplier',
    //         param: expense?.supplier?.name,
    //     });
    //
    //     const bill = bills.find((bill) => bill.id === expense.bill?.id) as Bill;
    //
    //     return new ExpenseConstructor({
    //         ...expense,
    //         bill,
    //         supplier,
    //     })
    // }
    //
    // private flattenParentsAndChildren(seeds: Array<Expense> = []) {
    //     return seeds.flatMap((item) => {
    //         if (!item.is_aggregate && Array.isArray(item?.children) && item.children.length > 0) {
    //             const childrenPrepared = item.children.map((child) => ({
    //                 ...child,
    //                 parent: item,
    //             }))
    //             return [
    //                 { ...item, children: undefined },
    //                 ...childrenPrepared
    //             ]
    //         }
    //         return item;
    //     })
    // }
    //
    // private async validateParent(expense: Expense) {
    //     if (!expense?.parent) {
    //         return;
    //     }
    //
    //     const parent = await this.findOne({ value: expense.parent.id, withRelations: true }) as Expense;
    //
    //     if (!parent?.children?.length) {
    //         await this.create({
    //             ...parent,
    //             children: [expense],
    //         });
    //         return;
    //     }
    //
    //     const existExpenseInChildren = parent.children.find((item) => item.id === expense.id);
    //
    //     if (!existExpenseInChildren) {
    //         parent.children.push(expense);
    //         await this.create(parent)
    //     }
    // }
    //
    // private async validateExistExpense(expense: Expense, withoutThrow?: boolean) {
    //     const filters: Array<FilterParams> = [
    //         {
    //             value: expense.name_code,
    //             param: 'expenses.name_code',
    //             relation: true,
    //             condition: 'LIKE',
    //         },
    //         {
    //             value: expense.year,
    //             param: 'expenses.year',
    //             relation: true,
    //             condition: '='
    //         }
    //     ];
    //     const result = await this.findAll({ withRelations: true, filters }) as Array<Expense>;
    //
    //     if (result.length && !withoutThrow) {
    //         throw this.error(new ConflictException('Expense already exists'));
    //     }
    //
    //     return result[0];
    //
    // }
    //
    // private buildExpenseToSheet(params: createToSheetParams) {
    //     const year = Number(params['year']);
    //     const bill = params['bill'] as Bill;
    //     const supplierName = params['supplier']?.toString() || '';
    //     const is_aggregate = Boolean(params['is_aggregate']) || false;
    //     const aggregate_name = params['aggregate_name']?.toString();
    //
    //     const name = !is_aggregate
    //         ? `${bill.name} ${supplierName}`
    //         : `${bill.name} ${aggregate_name} ${supplierName}`;
    //
    //     const childrenParams = params?.['children'];
    //     const children = Array.isArray(childrenParams) && childrenParams.length
    //         ? childrenParams
    //         : undefined
    //
    //     const type = params['type'] as EExpenseType ?? EExpenseType.VARIABLE;
    //
    //     return {
    //         year,
    //         bill,
    //         name,
    //         type,
    //         children,
    //         description: 'Generated by a spreadsheet.',
    //         supplierName,
    //         is_aggregate,
    //         aggregate_name
    //     }
    // }
    //
    // private async createToSheet(params: createToSheetParams) {
    //
    //     const builtExpense = this.buildExpenseToSheet(params);
    //
    //     const item = await this.findOne({
    //         value: builtExpense.name,
    //         filters: [{
    //             value: builtExpense.year,
    //             param: 'year',
    //             condition: '='
    //         }],
    //         withThrow: false,
    //         withDeleted: true,
    //         withRelations: true,
    //     });
    //
    //     if (item) {
    //         return item;
    //     }
    //
    //     const supplier = await this.supplierService.createToSheet(builtExpense.supplierName) as Supplier;
    //
    //     const parentExpenseConstructor = new ExpenseConstructor({
    //         ...builtExpense,
    //         supplier,
    //     });
    //
    //     const parentExpense = await this.create({ ...parentExpenseConstructor, children: undefined }) as Expense;
    //
    //     if (!parentExpenseConstructor.is_aggregate) {
    //         if (parentExpenseConstructor.children) {
    //             if (!parentExpense.children) {
    //                 parentExpense.children = [];
    //             }
    //             for (const child of parentExpenseConstructor.children) {
    //                 const builtChildExpense = this.buildExpenseToSheet(child);
    //                 const item = await this.findOne({
    //                     value: builtChildExpense.name,
    //                     filters: [{
    //                         value: builtChildExpense.year,
    //                         param: 'year',
    //                         condition: '='
    //                     }],
    //                     withThrow: false,
    //                     withDeleted: true,
    //                     withRelations: true,
    //                 });
    //                 if (item) {
    //                     parentExpense.children.push(item);
    //                 }
    //
    //                 const supplier = await this.supplierService.createToSheet(builtChildExpense.supplierName) as Supplier;
    //
    //                 const childExpenseConstructor = new ExpenseConstructor({
    //                     ...builtChildExpense,
    //                     supplier,
    //                 });
    //
    //                 const expense = await this.create(childExpenseConstructor);
    //                 if (expense) {
    //                     parentExpense.children.push(expense);
    //                 }
    //             }
    //             if (parentExpense.children.length) {
    //                 await this.create(parentExpense);
    //             }
    //         }
    //     }
    //     return parentExpense;
    // }
    //
    // async getExpensesFromSheet(
    //     year: number,
    //     spreadsheet: Spreadsheet,
    //     bills: Bill[],
    //     groupName: string,
    //     nextRow: number
    // ): Promise<Expense[]> {
    //     const expenses: Array<Expense> = [];
    //     const expensesData = this.expenseBusiness.spreadsheet.parseToDetailsTable({
    //         bills,
    //         startRow: nextRow,
    //         groupName,
    //         workSheet: spreadsheet.workSheet
    //     });
    //
    //     for (const itemData of expensesData) {
    //         const expense = await this.createToSheet({
    //             ...itemData,
    //             year,
    //         })
    //         if (expense) {
    //             expenses.push(expense);
    //         }
    //     }
    //
    //     return expenses;
    // }
    //
    // async buildForCreationBySpreadsheet(createdExpenses: Array<CreateExpenseDto>) {
    //     const listCreateExpenseDto: Array<CreateExpenseDto> = [];
    //
    //     for(const createExpenseDto of createdExpenses) {
    //         if(createExpenseDto?.supplier) {
    //             const supplier = await this.supplierService.createToSheet(createExpenseDto.supplier as string) as Supplier;
    //             listCreateExpenseDto.push({
    //                 ...createExpenseDto,
    //                 supplier,
    //             });
    //         }
    //     }
    //     return listCreateExpenseDto;
    // }
    //
    // async generateSeeds(withExpense: boolean, financeSeedsDir: string): Promise<ExpenseGenerateSeeds> {
    //     const expenses = await this.generateEntitySeeds({
    //         seedsDir: financeSeedsDir,
    //         staging: EXPENSE_LIST_STAGING_JSON,
    //         withSeed: withExpense,
    //         production:  EXPENSE_LIST_PRODUCTION_JSON,
    //         development: EXPENSE_LIST_DEVELOPMENT_JSON,
    //         withRelations: true,
    //         filterGenerateEntitySeedsFn: (json, item) => json.name === item.name || json.name_code === item.name_code,
    //     });
    //
    //     return {
    //         months: this.business.monthsMapper(expenses.added),
    //         expenses
    //     }
    // }
    //
    // async persistSeeds(withSeed: boolean) {
    //     const expenses = await this.persistEntitySeeds({
    //         withSeed,
    //         staging: EXPENSE_LIST_STAGING_JSON,
    //         production:  EXPENSE_LIST_PRODUCTION_JSON,
    //         development: EXPENSE_LIST_DEVELOPMENT_JSON,
    //     })
    //
    //     return {
    //         months: this.business.monthsMapper(expenses.added),
    //         expenses
    //     }
    // }
    //
    // public async buildExpensesToUpload(buffer: Buffer, uploadExpenseDto: UploadExpenseDto) {
    //     const spreadsheet = new Spreadsheet();
    //
    //     const worksheets = await spreadsheet.loadFile(buffer);
    //
    //     const worksheet = worksheets[0];
    //
    //     if (!worksheet) {
    //         throw new ConflictException('The Excel file does not contain any worksheets.');
    //     }
    //
    //     spreadsheet.updateWorkSheet(worksheet);
    //     const workSheet = spreadsheet.workSheet;
    //
    //     const createdExpenses = this.business.spreadsheet.buildForCreation(workSheet, uploadExpenseDto);
    //
    //     return await this.buildForCreationBySpreadsheet(createdExpenses);
    // }
    //
    // public buildExpensePersistence(year: number, createExpenseDtoList: Array<CreateExpenseDto>): Array<BuildExpensePersistenceResult> {
    //     return createExpenseDtoList.map((createExpenseDto) => {
    //         const month = this.monthService.business.generatePersistMonthParams({
    //             year,
    //             paid: createExpenseDto?.paid,
    //             value: createExpenseDto?.value,
    //             month: createExpenseDto?.month,
    //             received_at: createExpenseDto?.received_at
    //         });
    //         return {
    //             ...createExpenseDto,
    //             month
    //         };
    //     });
    // }
    //
    // cleanRepeatedPersistExpenseParams(buildExpensePersistenceResult: Array<BuildExpensePersistenceResult>): Array<PersistExpenseParams> {
    //     const initialPersistExpenseParams: Array<PersistExpenseParams> = [{
    //         type: EExpenseType.VARIABLE,
    //         value: 0,
    //         months: [],
    //         supplier: '',
    //         instalment_number: 1,
    //     }];
    //
    //     return buildExpensePersistenceResult.reduce((acc, item) => {
    //         const hasParam = acc.find((accItem) => accItem.supplier['name_code'] === item.supplier['name_code']);
    //         if(!hasParam) {
    //             const expenseToSave = buildExpensePersistenceResult.filter((bep) => bep.supplier['name_code'] === item.supplier['name_code']);
    //             const expenseMonths =  expenseToSave.flatMap((expense) => expense.month);
    //             acc.push({
    //                 type: item.type,
    //                 paid: item.paid,
    //                 value: 0,
    //                 months: expenseMonths,
    //                 supplier: item.supplier,
    //                 received_at: item.received_at,
    //             });
    //         }
    //         return acc;
    //     }, initialPersistExpenseParams).filter((item) => item.months.length > 0 && item.supplier !== '');
    // }
    //
    // async persistByUpload(expense: Expense,persistExpenseParams: PersistExpenseParams) {
    //     const isCreate = !expense?.id;
    //
    //     const savedExpense = isCreate ? await this.save(expense) as Expense : { ...expense};
    //
    //     const expenseMonths: Array<PersistMonthDto> = isCreate
    //         ? this.monthService.business.generateMonthListCreationParameters({
    //             year: savedExpense?.year,
    //             paid: savedExpense?.paid,
    //             months: persistExpenseParams.months,
    //             received_at: persistExpenseParams.received_at
    //         })
    //         : this.updateMonths(savedExpense.months, persistExpenseParams.months);
    //
    //     if(expenseMonths?.length > 0) {
    //         savedExpense.months = await this.monthService.persistList(expenseMonths, { expense: savedExpense });
    //         const savedExpenseCalculated = this.expenseBusiness.calculate(savedExpense);
    //         return await this.save(savedExpenseCalculated);
    //     }
    //
    //     return savedExpense;
    // }
    //
    // private updateMonths(currentMonths: Array<Month> = [], monthsToUpdate: Array<PersistMonthDto>) {
    //     return currentMonths.map((month) => {
    //         const monthToUpdate = monthsToUpdate.find((monthToUpdate) => monthToUpdate.code === month.code);
    //
    //         if(!monthToUpdate) {
    //             return month;
    //         }
    //
    //         month.paid = Boolean(monthToUpdate.paid);
    //         month.value = monthToUpdate.value !== month.value ? monthToUpdate.value : month.value;
    //         month.received_at = monthToUpdate.received_at !== month.received_at ? monthToUpdate.received_at : month.received_at;
    //         return month;
    //     })
    // }
}
