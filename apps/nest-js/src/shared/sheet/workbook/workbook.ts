import * as XLSX from 'xlsx';
import { type BookType } from 'xlsx';


type TSheet = 'base64' | 'binary' | 'buffer' | 'file' | 'array' | 'string';


export class Workbook {
    private readonly workbookModule: XLSX.WorkBook;

    constructor() {
        this.workbookModule = XLSX.utils.book_new();
    }

    addToWorkBook(workSheet: XLSX.WorkSheet, name: string = 'Sheet') {
        XLSX.utils.book_append_sheet(this.workbookModule, workSheet, String(name));
    }

    generateWorkBook(type: TSheet = 'buffer', bookType?: BookType, compression: boolean = true, cellStyles = true) {
        return XLSX.write(this.workbookModule, {
            type,
            bookType,
            cellStyles,
            compression
        })
    }

}