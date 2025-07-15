import { Controller, Get, Post, Res, UploadedFile, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { type Response } from 'express';

import { AuthRoleGuard } from '../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../guards/auth-status/auth-status.guard';
import { GetUserAuth } from '../decorators/auth-user/auth-user.decorator';
import { User } from '../auth/entities/user.entity';

import { UseFileUpload } from '../decorators/use-file-upload/use-file-upload.decorator';

import { FinanceService } from './finance.service';

@Controller('finance')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard)
export class FinanceController {
    constructor(private readonly service: FinanceService) {
    }

    @Post('/initialize')
    initialize(@GetUserAuth() user: User) {
        return this.service.initialize(user);
    }

    @Get('/generate-document')
    async generateDocument(@Res() res: Response, @GetUserAuth() user: User): Promise<void> {
        const buffer = await this.service.generateDocument(user);

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=controle_financeiro.xlsx',
            'Content-Length': buffer.length
        });

        res.send(buffer);
    }

    @Post('/upload')
    @UseFileUpload(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
    async initializeWithDocument(
        @UploadedFile() file: Express.Multer.File,
        @GetUserAuth() user: User
    ) {
      return await this.service.initializeWithDocument(file, user);
    }
}
