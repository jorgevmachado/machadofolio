import { BadRequestException } from '@nestjs/common';
import fs from 'fs';
import { join } from 'path';
import { writeFile } from 'fs/promises';

export class File {
    async upload(file: Express.Multer.File, filename?: string) {
        const filePath = this.getPath(file, filename);

        try {
            await writeFile(filePath, file.buffer);
        } catch (error) {
            console.error('# => FileService => upload => error => ', error);
            throw new BadRequestException('Failed to save file.');
        }

        return filePath;
    }

    getPath(file: Express.Multer.File, filename?: string) {
        if (!file) {
            throw new BadRequestException('File not received or invalid.');
        }
        const uploadsFolderPath = join(process.cwd(), 'uploads');
        const mimeType = file.mimetype.split('/')[1];
        const currentPath = filename
            ? `${filename}.${mimeType}`
            : file.originalname;
        const filePath = join(uploadsFolderPath, currentPath);

        if (fs.existsSync(filePath)) {
            throw new BadRequestException('File already exists or is invalid.');
        }

        return filePath;
    }
}