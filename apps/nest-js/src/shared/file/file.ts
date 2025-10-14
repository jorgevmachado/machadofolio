import { BadRequestException } from '@nestjs/common';
import fs, { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { writeFile } from 'fs/promises';

export class File {
    constructor(protected env: string) {}
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

    createDirectory(pathDir: string, rootDir?: string) {
        const path = join(!rootDir ? process.cwd() : rootDir, pathDir);
        if (!existsSync(path)) {
            mkdirSync(path);
        }
        return path;
    }

    getSeedsDirectory(path: string = this.env) {
        const rootDir = this.createDirectory('seeds');
        return this.createDirectory(path, rootDir);
    }

    writeFile(fileName: string, pathDir: string, content: unknown) {
        return writeFileSync(join(pathDir, fileName), JSON.stringify(content, null, 2));
    }
}