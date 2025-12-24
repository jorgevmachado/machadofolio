import { Repository } from 'typeorm';

import {
  EMonth ,
  Error ,
  ERROR_STATUS_CODE ,
  getCurrentMonthNumber ,
  getMonthByIndex ,
  matchesRepeatWords ,
  MONTHS ,
  snakeCaseToNormal ,
  Spreadsheet ,
  type WorkSheet ,
} from '@repo/services';

import {
  Bill as BillConstructor ,
  BillBusiness ,
  BillExpenseToCreation ,
  BuildForCreationParams,
  EBillType ,
} from '@repo/business';

import BILL_LIST_DEVELOPMENT_JSON
  from '../../../seeds/development/finance/bills.json';
import BILL_LIST_PRODUCTION_JSON
  from '../../../seeds/production/finance/bills.json';
import BILL_LIST_STAGING_JSON from '../../../seeds/staging/finance/bills.json';
import { ListParams ,SeedsGenerated ,Service } from '../../shared';

import { BankService } from '../bank/bank.service';
import { Bank } from '../entities/bank.entity';
import { Bill } from '../entities/bill.entity';
import { Expense } from '../entities/expense.entity';
import { Finance } from '../entities/finance.entity';
import { Group } from '../entities/group.entity';
import { Month } from '../entities/month.entity';
import { GroupService } from '../group/group.service';

import { CreateBillDto } from './dto/create-bill.dto';
import { UploadBillDto } from './dto/uoload-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { CreateExpenseDto } from './expense/dto/create-expense.dto';
import { UploadsExpenseDto } from './expense/dto/uploads-expense.dto';
import { ExpenseService } from './expense/expense.service';
import { BillExpenseToCreate ,BillExpenseToCreateParams } from './types';

import { ConflictException ,Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

type GeneratedBillSeeds = {
  bills: SeedsGenerated<Bill>;
  months: Array<Month>;
  expenses: SeedsGenerated<Expense>;
}

@Injectable()
export class BillService extends Service<Bill> {
  constructor(
    @InjectRepository(Bill)
    protected repository: Repository<Bill> ,
    protected billBusiness: BillBusiness ,
    protected readonly bankService: BankService ,
    protected readonly groupService: GroupService ,
    protected readonly expenseService: ExpenseService ,
  ) {
    super(
      'bills' ,
      [
        'bank' ,
        'group' ,
        'finance' ,
        'expenses' ,
        'expenses.months' ,
        'expenses.supplier' ,
        'expenses.bill' ,
        'expenses.children' ,
        'expenses.children.supplier'] ,
      repository ,
    );
  }

  get expense(): ExpenseService {
    return this.expenseService;
  }

  async create(finance: Finance ,createBillDto: CreateBillDto) {
    const bank = await this.bankService.treatEntityParam<Bank>(
      createBillDto.bank ,
      'Bank' ,
    ) as Bank;

    const group = await this.groupService.treatEntityParam<Group>(
      createBillDto.group ,
      'Group' ,
    ) as Group;

    const name = `${ group.name } ${ snakeCaseToNormal(
      createBillDto.type) } ${ bank.name }`;

    const type = createBillDto.type;

    const bill = new BillConstructor({
      name: type === EBillType.CREDIT_CARD ? `${ name } ${ bank.name }` : name ,
      year: createBillDto.year ,
      type ,
      finance ,
      bank ,
      group ,
    });

    return await this.customSave(bill);
  }

  async update(finance: Finance ,param: string ,updateBillDto: UpdateBillDto) {
    const result = await this.findOne({ value: param }) as Bill;

    const bank = !updateBillDto.bank
      ? result.bank
      : await this.bankService.treatEntityParam<Bank>(
        updateBillDto.bank ,
        'Bank' ,
      ) as Bank;

    const group = !updateBillDto.group
      ? result.group
      : await this.groupService.treatEntityParam<Group>(
        updateBillDto.group ,
        'Bill Category' ,
      ) as Group;

    const expenses = !updateBillDto.expenses
      ? result.expenses
      : await Promise.all(
        await this.expenseService.treatEntitiesParams<Expense>(
          updateBillDto.expenses ,
          'Expense' ,
        ) ,
      ) as Array<Expense>;

    const year = !updateBillDto.year ? result.year : updateBillDto.year;
    const type = !updateBillDto.type ? result.type : updateBillDto.type;
    const name =
      !updateBillDto.group && !updateBillDto.type
        ? result.name
        : `${ group.name } ${ snakeCaseToNormal(type) } ${ bank.name }`;

    const updatedBill = new BillConstructor({
      ...result ,
      name ,
      year ,
      type ,
      finance ,
      bank ,
      group ,
      expenses ,
    });
    return await this.customSave(updatedBill);
  }

  async remove(param: string) {
    const result = await this.findOne({
      value: param ,
      relations: this.relations ,
    }) as Bill;
    if (result?.expenses?.length) {
      throw this.error(
        new ConflictException(
          'You cannot delete this bill because it is already in use.' ,
        ) ,
      );
    }
    await this.repository.softRemove(result);
    return { message: 'Successfully removed' };
  }

  async findAllExpense(param: string ,params: ListParams) {
    const bill = await this.findOne(
      { value: param ,withRelations: true }) as Bill;
    return await this.expenseService.findAll({
      ...params ,
      filters: [
        {
          value: bill.id ,
          param: 'bill' ,
          condition: '=' ,
        } ,
        {
          value: false ,
          param: 'is_aggregate' ,
          condition: '=' ,
        } ,
      ] ,
      withRelations: true ,
    });
  }

  async addExpense(value: string ,createExpenseDto: CreateExpenseDto) {
    const bill = await this.findOne({ value ,withRelations: true }) as Bill;
    const {
      nextYear ,
      requiresNewBill ,
      monthsForNextYear ,
      expenseForNextYear ,
      expenseForCurrentYear ,
    } = await this.expenseService.create(bill ,createExpenseDto);

    if (requiresNewBill && expenseForNextYear) {
      const newBill = await this.create(
        bill.finance ,
        { ...bill ,year: nextYear } ,
      ) as Bill;

      await this.expenseService.create(newBill ,
        { ...expenseForNextYear ,months: monthsForNextYear });
    }

    return expenseForCurrentYear;
  }

  async persistExpensesByUpload(
    files: Express.Multer.File[] ,param: string ,
    uploadsExpenseDto: UploadsExpenseDto) {
    const bill = await this.findOne(
      { value: param ,withRelations: true }) as Bill;
    return this.expenseService.uploads(bill ,files ,uploadsExpenseDto);
  }

  async generateSeeds(
    withBill: boolean ,withExpense: boolean ,
    financeSeedsDir: string): Promise<GeneratedBillSeeds> {
    const { months ,expenses } = await this.expenseService.generateSeeds(
      withExpense ,financeSeedsDir);
    const bills = await this.generateEntitySeeds({
      seedsDir: financeSeedsDir ,
      staging: BILL_LIST_STAGING_JSON ,
      withSeed: !(!withBill && !withExpense) ,
      production: BILL_LIST_PRODUCTION_JSON ,
      development: BILL_LIST_DEVELOPMENT_JSON ,
      withRelations: true ,
      filterGenerateEntityFn: (json ,item) => json.name === item.name ||
        json.name_code === item.name_code || json.expenses === item.expenses ,
    });

    return { bills ,months ,expenses };
  }

  async persistSeeds(withBill: boolean ,withExpense: boolean) {
    const bills = await this.seeder.persistEntity({
      withSeed: !(!withBill && !withExpense) ,
      staging: BILL_LIST_STAGING_JSON ,
      production: BILL_LIST_PRODUCTION_JSON ,
      development: BILL_LIST_DEVELOPMENT_JSON ,
    });

    const { months ,expenses } = await this.expenseService.persistSeeds(
      withExpense);

    return {
      bills ,
      months ,
      expenses ,
    };
  }

  async newPersistBillExpenseByUpload(
    finance: Finance ,
    file: Express.Multer.File ,uploadBillDto: UploadBillDto) {
    if (!file || !file?.buffer) {
      throw this.error(new ConflictException(
        'one of the files was not uploaded or is invalid.'));
    }

    const spreadsheet = new Spreadsheet();

    const worksheets = await spreadsheet.loadFile(file.buffer);

    const worksheet = worksheets[0];

    if (!worksheet) {
      throw this.error(new ConflictException(
        'The Excel file does not contain any worksheets.'));
    }

    spreadsheet.updateWorkSheet(worksheet);
    const workSheet = spreadsheet.workSheet;

    const buildForCreationParams: BuildForCreationParams = {
      fields: [
        {
          row: 1 ,
          column: 1 ,
          field: 'date' ,
          label: 'Date' ,
        },
        {
          row: 1 ,
          column: 2 ,
          field: 'title' ,
          label: 'Title' ,
        },
        {
          row: 1 ,
          column: 3 ,
          field: 'amount' ,
          label: 'Amount' ,
        },
        {
          row: 1 ,
          column: 4 ,
          field: 'group' ,
          label: 'Group' ,
        },
        {
          row: 1 ,
          column: 5 ,
          field: 'type' ,
          label: 'Type' ,
        },
        {
          row: 1 ,
          column: 6 ,
          field: 'paid' ,
          label: 'Paid' ,
        },
        {
          row: 1 ,
          column: 7 ,
          field: 'bank' ,
          label: 'Bank' ,
        },
      ],
      finance,
      workSheet,
      uploadBillParams: uploadBillDto,
    }
    const billExpenseToCreation: Array<BillExpenseToCreation> = this.billBusiness.spreadsheet.buildForCreation(buildForCreationParams);
    const createExpenseListToCreate: Array<BillExpenseToCreate> = await this.newBuildExpenseListToCreate(finance, billExpenseToCreation)


    await this.expenseService.upload(createExpenseListToCreate);

    return await this.findAll({ withRelations: true })
  }

  private async newBuildExpenseListToCreate(
    finance:Finance,
    billExpenseToCreation: Array<BillExpenseToCreation>
  ) {

    const billExpenseToCreate: Array<BillExpenseToCreate> = [];

    for (const item of billExpenseToCreation) {
      const group = await this.groupService.createToSheet(item.finance as Finance ,item.group) as Group;
      const bank = await this.bankService.createToSheet(item.bank) as Bank;
      const bill = await this.createToSheet(finance, group ,bank ,item.type as EBillType ,item.year) as Bill;
      billExpenseToCreate.push({
        ...item,
        finance: finance as Finance,
        bill
      })
    }
    return billExpenseToCreate;
  }

  async persistBillExpenseByUpload(
    finance: Finance ,
    file: Express.Multer.File ,uploadBillDto: UploadBillDto) {
    if (!file || !file?.buffer) {
      throw this.error(new ConflictException(
        'one of the files was not uploaded or is invalid.'));
    }

    const spreadsheet = new Spreadsheet();

    const worksheets = await spreadsheet.loadFile(file.buffer);

    const worksheet = worksheets[0];

    if (!worksheet) {
      throw this.error(new ConflictException(
        'The Excel file does not contain any worksheets.'));
    }

    spreadsheet.updateWorkSheet(worksheet);
    const workSheet = spreadsheet.workSheet;

    const uploadBill: UploadBillDto = {
      file: '' ,
      replaceWords: uploadBillDto?.replaceWords ,
      repeatedWords: uploadBillDto?.repeatedWords ,
    };

    const createExpenseListToCreate = await this.buildExpenseListToCreate(
      finance ,workSheet ,uploadBill);

    await this.expenseService.upload(createExpenseListToCreate);

    return await this.findAll({ withRelations: true })
  }

  private async buildExpenseListToCreate(
    finance: Finance ,
    workSheet: WorkSheet ,
    uploadBill: UploadBillDto,
  ) {
    const fieldDate = workSheet.getCell(1 ,1)?.value;
    this.validateFieldSheet('Date' ,fieldDate);
    const fieldTitle = workSheet.getCell(1 ,2)?.value;
    this.validateFieldSheet('Title' ,fieldTitle);
    const fieldAmount = workSheet.getCell(1 ,3)?.value;
    this.validateFieldSheet('Amount' ,fieldAmount);
    const fieldGroup = workSheet.getCell(1,4)?.value;
    this.validateFieldSheet('Group' ,fieldGroup);
    const fieldType = workSheet.getCell(1,5)?.value;
    this.validateFieldSheet('Type' ,fieldType);
    const fieldPaid = workSheet.getCell(1,6)?.value;
    this.validateFieldSheet('Paid' ,fieldPaid);
    const fieldBank = workSheet.getCell(1,7)?.value;
    this.validateFieldSheet('Bank' ,fieldBank);

    const { totalRows ,nextRow } = this.validateWorkSheetToBuild(workSheet);

    const billExpenseToCreateParams: Array<BillExpenseToCreateParams> = [];

    for (let i = 0; i < totalRows; i++) {
      const cellDate = workSheet.cell(nextRow + i ,1)?.
      value?.
      toString()?.
      trim() || '';
      const dateFromCell = new Date(cellDate);
      const date = isNaN(dateFromCell.getDate()) ? new Date() : dateFromCell;
      const month = getMonthByIndex(date.getMonth());
      const year = date.getFullYear();

      const cellTitle = workSheet.cell(nextRow + i ,2)?.
      value?.
      toString()?.
      trim() || 'END';

      const cellAmount = workSheet.cell(nextRow + i ,3)?.
      value?.
      toString()?.
      trim() || 'END';

      const cellGroup = workSheet.cell(nextRow + i ,4)?.
      value?.
      toString()?.
      trim() || 'END';

      const cellType = workSheet.cell(nextRow + i ,5)?.
      value?.
      toString()?.
      trim() || 'END';

      const cellPaid = workSheet.cell(nextRow + i ,6)?.
      value?.
      toString()?.
      trim() || 'END';
      const paid = uploadBill?.paid ?? cellPaid === 'SIM';

      const cellBank = workSheet.cell(nextRow + i ,7)?.
      value?.
      toString()?.
      trim() || 'END';

      const rulesRepeatedWords = uploadBill?.repeatedWords ?? [];

      const isRepeatWord = cellTitle !== 'END' && matchesRepeatWords(cellTitle, rulesRepeatedWords);

      if(!isRepeatWord) {
        const billExpenseToCreateParam: BillExpenseToCreateParams = {
          year ,
          paid ,
          date ,
          type: cellType ,
          bank: cellBank ,
          month ,
          group: cellGroup ,
          title: cellTitle ,
          amount: cellAmount ,
          finance: finance,
        };
        billExpenseToCreateParams.push(billExpenseToCreateParam);
      }
    }
    return await this.buildBillExpenseToCreate(finance,billExpenseToCreateParams);
  }

  private validateFieldSheet(field: string, value?: string) {
    if(!value || value === '') {
      throw this.error(new ConflictException(
        `The ${field} field is required in the spreadsheet.`));
    }
  }

  private async buildBillExpenseToCreate(finance: Finance, billExpenseToCreateParams: Array<BillExpenseToCreateParams>): Promise<Array<BillExpenseToCreate>> {
    const filtered = billExpenseToCreateParams.filter(
      b => b.title !== 'END' && b.group !== 'END' && b.type !== 'END' ,
    );

    const params = new Map<string ,Array<BillExpenseToCreateParams>>();
    filtered.forEach((item) => {
      const key = `${ item.title }__${ item.group }__${ item.type }`;
      if (!params.has(key)) {
        params.set(key ,[]);
      }
      params.get(key)?.push(item);
    });

    const list = Array.from(params.values()).map(param => {
      const monthMap = new Map<string ,string>();
      param.forEach(item => {
        const month = item.month;
        if (month) {
          monthMap.set(month ,item.amount);
        }
      });
      const groupListItem = param[0];

      const currentDate = new Date();

      const months: BillExpenseToCreate['months'] = MONTHS.map(month => {
        const strValue = monthMap.get(month) ?? '0.00';
        const value = Number(strValue);
        return {
          year: groupListItem?.year ?? currentDate.getFullYear() ,
          paid: groupListItem?.paid ?? false ,
          code: getCurrentMonthNumber(month) ,
          value ,
          label: month ,
          month: month.toUpperCase() as EMonth ,
          received_at: groupListItem?.date ?? currentDate,
        };
      });
      const total = months.reduce((acc ,item) => acc + Number(item.value) ,0);

      return {
        ...groupListItem ,
        paid: groupListItem?.paid ?? false ,
        year: groupListItem?.year ?? currentDate.getFullYear() ,
        type: groupListItem?.type ?? EBillType.BANK_SLIP,
        bank: groupListItem?.bank ?? 'Nubank',
        date: groupListItem?.date ?? currentDate,
        title: groupListItem?.title ?? 'unknow',
        group: groupListItem?.group ?? 'unknow' ,
        amount: total.toFixed(2) ,
        months ,
      };
    });

    const billExpenseToCreate: Array<BillExpenseToCreate> = [];

    for (const item of list) {
      const group = await this.groupService.createToSheet(item.finance as Finance ,item.group) as Group;
      const bank = await this.bankService.createToSheet(item.bank) as Bank;
      const bill = await this.createToSheet(finance, group ,bank ,item.type as EBillType ,item.year) as Bill;
      billExpenseToCreate.push({
        ...item,
        finance: finance as Finance,
        bill
      })
    }
    return billExpenseToCreate;
  }

  private validateWorkSheetToBuild(workSheet: WorkSheet) {
    const { totalRows ,nextRow } = workSheet.getCell(1 ,1);

    if (totalRows <= 0) {
      throw new Error({
        message: 'The Excel file does not have any rows for Date column.' ,
        statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION ,
      });
    }

    const { totalRows: cellDateRows } = workSheet.getCell(1 ,2);

    if (totalRows !== cellDateRows) {
      throw new Error({
        message: 'The Excel file does not have the same number of rows for Date columns.' ,
        statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION ,
      });
    }

    const { totalRows: cellTitleRows } = workSheet.getCell(1 ,3);

    if (totalRows !== cellTitleRows) {
      throw new Error({
        message: 'The Excel file does not have the same number of rows for Date and title columns.' ,
        statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION ,
      });
    }

    const { totalRows: cellAmountRows } = workSheet.getCell(1 ,4);

    if (totalRows !== cellAmountRows) {
      throw new Error({
        message: 'The Excel file does not have the same number of rows for Date and amount columns.' ,
        statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION ,
      });
    }

    const { totalRows: cellGroupRows } = workSheet.getCell(1 ,5);

    if (totalRows !== cellGroupRows) {
      throw new Error({
        message: 'The Excel file does not have the same number of rows for Date and groups columns.' ,
        statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION ,
      });
    }

    const { totalRows: cellTypeRows } = workSheet.getCell(1 ,6);

    if (totalRows !== cellTypeRows) {
      throw new Error({
        message: 'The Excel file does not have the same number of rows for Date and type columns.' ,
        statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION ,
      });
    }

    return {
      nextRow ,
      totalRows ,
    };
  }

  private async createToSheet(finance: Finance  ,group: Group ,bank: Bank ,type: EBillType ,year: number) {

    const billList = await this.findAll({
      withRelations: true ,
      filters: [
        {
          value: year ,
          param: 'year' ,
          condition: '=' ,
        } ,
        {
          value: group.name_code ,
          param: 'group.name_code' ,
          relation: true ,
          condition: '=' ,
        } ,
        {
          value: bank.name_code ,
          param: 'bank.name_code' ,
          relation: true ,
          condition: '=' ,
        },
      ],
    }) as Array<Bill>;

    if (!billList || billList.length === 0) {
      const name = `${ group.name } ${ snakeCaseToNormal(type) } ${ bank.name }`;
      const bill = new BillConstructor({
        name: type === EBillType.CREDIT_CARD ? `${ name } ${ bank.name }` : name ,
        year,
        type,
        finance ,
        bank ,
        group ,
      });
      return await this.customSave(bill);
    }
    return billList[0];
  }

  private async customSave(bill: Bill ,withThrow = true) {
    const existBill = await this.findOne({
      value: bill.name ,
      filters: [
        {
          value: bill.year ,
          param: 'year' ,
          condition: '=' ,
        }] ,
      withThrow: false ,
    });
    if (existBill) {
      if (withThrow) {
        throw new ConflictException(
          `Key (name)=(${ bill.name }) already exists with this (year)=(${ bill.year }).` ,
        );
      }
      return existBill;
    }
    const calculatedBill = this.billBusiness.calculate(bill);
    return await this.save(calculatedBill);
  }
}
