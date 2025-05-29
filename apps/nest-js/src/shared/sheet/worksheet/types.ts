export type MergePosition = {
    endRow: number;
    startRow: number;
    endColumn: number;
    startColumn: number;
}

export type CellStyle = {
    readonly font?: {
        readonly sz?: number;
        readonly bold?: boolean;
        readonly name?: string;
    };
    readonly alignment?: {
        readonly vertical?: string;
        readonly horizontal?: string;
        readonly wrapText?: boolean;
    };
    readonly border?: {
        readonly top?: { readonly style: string };
        readonly bottom?: { readonly style: string };
        readonly left?: { readonly style: string };
        readonly right?: { readonly style: string };
    };
    readonly borderLabel?: string;
}

export type Position = {
    row: number;
    column: number;
};

export type AddTitleParams = {
    value: string;
    style?: Partial<CellStyle>;
    cellLabel?: string;
    cellPosition?: Position;
    mergePosition?: MergePosition;
}

type HeaderTable = Omit<AddTitleParams, 'value'> & {
    list: Array<string>;
}

type BodyTable = Omit<AddTitleParams, 'value'> & {
    list: Array<Record<string, string | number | boolean>>
};

export type AddTableParams = {
    body: BodyTable;
    title: AddTitleParams;
    header: HeaderTable;
    position: Position;
}

export type TreatCellParams = {
    label?: string;
    position?: Position;
}