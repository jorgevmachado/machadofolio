import {
    BadRequestException,
    UseInterceptors,
    applyDecorators,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

import * as fs from 'fs';
import * as multer from 'multer';

export const UseMultipleFileUpload = (allowedTypes: Array<string>, maxFiles = 12) => {
    return applyDecorators(
        UseInterceptors(
            FilesInterceptor('files', maxFiles, {
                storage: multer.memoryStorage(),
                fileFilter: (req, file, callback) => {
                    if (!allowedTypes.includes(file.mimetype)) {
                        return callback(
                            new BadRequestException('File type not allowed.'),
                            false,
                        );
                    }
                    const uploadsFolderPath = join(process.cwd(), 'uploads');
                    const filePath = join(uploadsFolderPath, file.originalname);

                    if (fs.existsSync(filePath)) {
                        return callback(
                            new BadRequestException('File already exists or is invalid.'),
                            false,
                        );
                    }

                    callback(null, true);
                },
            }),
        ),
    );
};
