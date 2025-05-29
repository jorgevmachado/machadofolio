import * as XLSX from 'xlsx';
import type { AddTableParams, AddTitleParams, CellStyle, MergePosition, Position, TreatCellParams } from './types';

export class WorkSheet {
    private readonly rows: number;
    private readonly columns: number;
    private readonly worksheetModule: XLSX.WorkSheet;


    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.columns = columns;
        const initialData = Array(this.rows).fill(null).map(() => Array(this.columns).fill(''));
        this.worksheetModule = XLSX.utils.aoa_to_sheet(initialData);

        this.configureWorkSheet();
    }

    get workSheet(): XLSX.WorkSheet {
        return this.worksheetModule;
    }

    private configureWorkSheet() {
        // Configurar larguras das colunas uma única vez
        this.worksheetModule['!cols'] = Array(this.columns).fill({ wch: 15 });
        // Configurar alturas das linhas uma única vez
        this.worksheetModule['!rows'] = Array(this.rows).fill({ hpt: 30 });
        this.worksheetModule['!merges'] = [];
    }

    public addTitle({ value, style, cellLabel, cellPosition, mergePosition }: AddTitleParams) {
        this.mergeCells(mergePosition);
        const cell = this.treatCell({ label: cellLabel, position: cellPosition });
        this.worksheetModule[cell] = {
            v: String(value),
            t: 's',
            s: this.createCellStyle(style)
        }
    }

    private mergeCells(position?: MergePosition) {
        if (position) {
            this.worksheetModule['!merges']?.push({
                s: { r: position.startRow, c: position.startColumn },
                e: { r: position.endRow, c: position.endColumn },
            });
        }
    }

    public addTable({ body, title, header, position }: AddTableParams) {
        this.addTitle(title);
        this.addTableHeader(header, position);
        this.addTableBody(body, header.list, position);
    }

    private addTableHeader(header: AddTableParams['header'], position: Position) {
        const list = header.list;
        list.forEach((value, index) => {
            this.addTitle({
                value,
                style: header.style,
                cellPosition: { row: position.row + 1, column: position.column + index }
            });
        });
    }

    private addTableBody(body: AddTableParams['body'], headers: Array<string>, position: Position) {
        const list = body.list;
        const data = this.transformToTableBody(list, headers);
        data.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                this.addTitle({
                    value: cell,
                    style: body.style,
                    cellPosition: {
                        row: position.row + 2 + rowIndex,
                        column: position.column + cellIndex,
                    }
                })
            })
        })
    }

    private transformToTableBody(items: AddTableParams['body']['list'], headers: Array<string>) {
        return items.map((item) => {
            return headers.map((header) => {
                const value = item[header];
                if (typeof value === 'boolean') {
                    return value ? 'SIM' : 'NÃO';
                }
                if (typeof value === 'number') {
                    return String(value || '0');
                }
                return String(value || '');
            });
        })
    }

    private treatCell({ label = 'B2', position }: TreatCellParams) {
        if (!position) {
            return label;
        }
        return XLSX.utils.encode_cell({ r: position.row, c: position?.column });
    }

    private createCellStyle(style?: Partial<CellStyle>): CellStyle {
        return {
            font: {
                sz: 14,
                bold: true,
                name: 'Arial',
                ...style?.font
            },
            alignment: {
                vertical: 'center',
                horizontal: 'center',
                wrapText: true,
                ...style?.alignment
            },
            border: this.createBorder(style?.borderLabel ?? 'medium')
        }
    }

    private createBorder(style: string): Required<NonNullable<CellStyle['border']>> {
        return {
            top: { style },
            bottom: { style },
            left: { style },
            right: { style }
        };
    }

}