import { WorkSheet } from './worksheet';
import { Workbook } from './workbook';

export class Sheet {
    private readonly workbookInstance: Workbook;
    private worksheetInstance: WorkSheet | null;


    constructor() {
        this.workbookInstance = new Workbook();
        this.worksheetInstance = null;
    }

    get workBook(): Workbook {
        return this.workbookInstance;
    }

    get workSheet(): WorkSheet {
        if (!this.worksheetInstance) {
            throw new Error('Worksheet não foi inicializado. Use createWorksheet primeiro.');
        }
        return this.worksheetInstance;
    }


    createWorkSheet(rows: number, columns: number) {
        this.worksheetInstance = new WorkSheet(rows, columns);
    }
}