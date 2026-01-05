import { type QueryParameters } from '@repo/business';

import { User } from '../../auth/entities/user.entity';
import { GetUserAuth } from '../../decorators/auth-user/auth-user.decorator';
import {
  UseFileUpload
} from '../../decorators/use-file-upload/use-file-upload.decorator';
import { UseMultipleFileUpload } from '../../decorators/use-multiple-file-upload/use-multiple-file-upload.decorator';
import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';
import { FinanceInitializeGuard } from '../../guards/finance-initialize/finance-initialize.guard';
import { ListParams } from '../../shared';

import { Finance } from '../entities/finance.entity';

import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UploadBillDto } from './dto/uoload-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { CreateExpenseDto } from './expense/dto/create-expense.dto';
import { UploadsExpenseDto } from './expense/dto/uploads-expense.dto';

import {
  Body ,Controller ,Delete ,Get ,Param ,Post ,Put ,Query ,
  UploadedFile ,UploadedFiles ,UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('finance/bill')
@UseGuards(
    AuthGuard(),
    AuthRoleGuard,
    AuthStatusGuard,
    FinanceInitializeGuard,
)
export class BillController {
    constructor(private readonly service: BillService) {
    }

    @Get()
    findAll(@GetUserAuth() user: User, @Query() parameters: QueryParameters) {
        const finance = user.finance as Finance;
        const filters: ListParams['filters'] = [{
            value: finance.id,
            param: 'finance',
            condition: '='
        }]
        return this.service.findAll({ parameters, filters, withRelations: Boolean(parameters?.withRelations) });
    }

    @Post()
    create(@GetUserAuth() user: User, @Body() createBillDto: CreateBillDto) {
        return this.service.create(user.finance as Finance, createBillDto);
    }

    @Put(':param')
    update(
        @GetUserAuth() user: User,
        @Param('param') param: string,
        @Body() updateBillDto: UpdateBillDto,
    ) {
        return this.service.update(user.finance as Finance, param, updateBillDto);
    }

    @Get(':param')
    findOne(@Param('param') param: string) {
        return this.service.findOne({ value: param, withRelations: true });
    }

    @Delete(':param')
    remove(@Param('param') param: string) {
        return this.service.remove(param);
    }

    @Post(':param/expense')
    addExpense(@Param('param') param: string, @Body() createExpenseDto: CreateExpenseDto) {
        return this.service.addExpense(param, createExpenseDto);
    }

    @Get(':param/list/expense')
    findAllExpenseByBill(@Param('param') param: string, @Query() parameters: QueryParameters) {
        return this.service.findAllExpense(param, { parameters });
    }

    @Post(':param/expense/uploads')
    @UseMultipleFileUpload(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'], 12)
    persistExpensesByUpload(
        @UploadedFiles() files: Express.Multer.File[],
        @Param('param') param: string,
        @Body() uploadsExpenseDto: UploadsExpenseDto,
    ) {
        return this.service.persistExpensesByUpload(files, param, uploadsExpenseDto);
    }

    @Post('/upload')
    @UseFileUpload(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
    persistBillExpenseByUpload (
      @GetUserAuth() user: User,
      @UploadedFile() file: Express.Multer.File,
      @Body() uploadBillDto: UploadBillDto,
    ) {
      const finance = user.finance as Finance;
      return this.service.persistBillExpenseByUpload(finance, file, uploadBillDto);
    }
}