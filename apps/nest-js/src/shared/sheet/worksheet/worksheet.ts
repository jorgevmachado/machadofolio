import * as XLSX from 'xlsx';

import { Cell, type CellParamsConstructor } from './cell';
import { Table, type TableParamsConstructor } from './table';

export class WorkSheet {
    private readonly rows: number;
    private readonly columns: number;
    private readonly worksheetModule: XLSX.WorkSheet;

    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.columns = columns;
        const initialData = Array(this.rows).fill(null).map(() => Array(this.columns).fill(''));
        this.worksheetModule = XLSX.utils.aoa_to_sheet(initialData);
        this.worksheetModule['!cols'] = Array(this.columns).fill({ wch: 15 });
        this.worksheetModule['!rows'] = Array(this.rows).fill({ hpt: 30 });
        this.worksheetModule['!merges'] = [];
    }

    get workSheet(): XLSX.WorkSheet {
        return this.worksheetModule;
    }

    public addTitle(params: CellParamsConstructor) {
        const cellBuilder = new Cell(params);
        if (cellBuilder?.merge) {
            this.worksheetModule['!merges']?.push(cellBuilder.merge);
        }
        this.worksheetModule[cellBuilder.cell] = cellBuilder.toXLSX();
    }

    public AddTable(params: TableParamsConstructor) {
        const table = new Table(params);
        this.addTitle(table.title);
        this.addTableHeader(table.header);
        this.addTableBody(table.body);
        return table.nextPositionRow;
    }

    private addTableHeader(params: Array<CellParamsConstructor>) {
        params.forEach((value) => {
            this.addTitle(value)
        })
    }

    private addTableBody(params: Array<CellParamsConstructor>) {
        params.forEach((value) => {
            this.addTitle(value)
        })
    }
}